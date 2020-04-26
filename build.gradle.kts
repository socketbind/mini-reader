import com.moowork.gradle.node.npm.NpmTask
import org.hidetake.groovy.ssh.core.Remote
import org.hidetake.groovy.ssh.core.RunHandler
import org.hidetake.groovy.ssh.core.Service
import org.hidetake.groovy.ssh.session.SessionHandler
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile

val logback_version: String by project
val ktor_version: String by project
val kotlin_version: String by project

plugins {
    application
    kotlin("jvm") version "1.3.70"
    id("com.github.node-gradle.node") version "2.2.2"
    id("com.github.johnrengelman.shadow") version "5.0.0"
    id("org.hidetake.ssh") version "2.10.1"
}

group = "site.konyv"
version = "0.0.1-SNAPSHOT"

application {
    mainClassName = "io.ktor.server.netty.EngineMain"
}

repositories {
    mavenLocal()
    jcenter()
    maven { url = uri("https://kotlin.bintray.com/ktor") }
    maven { url = uri("https://kotlin.bintray.com/kotlinx") }
    maven { url = uri("https://kotlin.bintray.com/kotlin-js-wrappers") }
}

val compileKotlin: KotlinCompile by tasks

compileKotlin.kotlinOptions {
    languageVersion = "1.3"
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-stdlib-jdk8:$kotlin_version")
    implementation("io.ktor:ktor-server-netty:$ktor_version")
    implementation("ch.qos.logback:logback-classic:$logback_version")
    implementation("io.ktor:ktor-client-core:$ktor_version")
    implementation("io.ktor:ktor-client-core-jvm:$ktor_version")
    implementation("io.ktor:ktor-client-json-jvm:$ktor_version")
    implementation("io.ktor:ktor-client-cio:$ktor_version")
    implementation("io.ktor:ktor-client-jackson:$ktor_version")
    implementation("io.ktor:ktor-client-logging-jvm:$ktor_version")
    implementation("io.ktor:ktor-server-core:$ktor_version")
    implementation("io.ktor:ktor-server-host-common:$ktor_version")
    implementation("io.ktor:ktor-jackson:$ktor_version")
    implementation("io.ktor:ktor-mustache:$ktor_version")
    implementation("io.ktor:ktor-metrics:$ktor_version")
    testImplementation("io.ktor:ktor-server-tests:$ktor_version")
}

val frontendProjectDir = file("$projectDir/frontend")
val frontendResourceDir = file("$frontendProjectDir/dist")
val frontendDistDir = file("$frontendProjectDir/dist/frontend")

sourceSets["main"].resources.srcDirs(frontendResourceDir)

node {
    download = true
}

val itsy = remotes.create("itsy") {
    host = "deploy.itsy.photos"
    user = "root"
    identity = file("${System.getProperty("user.home")}/.ssh/id_rsa")
}

tasks {
    val frontendInstall by registering(NpmTask::class)
    val frontendBuild by registering(NpmTask::class)

    named<Delete>("clean") {
        delete.addAll(listOf(
            "$frontendProjectDir/.cache",
            "$frontendProjectDir/node_modules",
            "$frontendProjectDir/dist"
        ))
    }

    frontendInstall {
        workingDir = frontendProjectDir
        args += "install"
        inputs.file("$frontendProjectDir/package.json")
        outputs.dir("$frontendProjectDir/node_modules")
    }

    frontendBuild {
        val publicUrl = System.getenv("APP_CDN_DOMAIN") ?: "/"

        workingDir = frontendProjectDir
        args += (listOf("run-script", "build", "--", "--public-url", publicUrl))
        dependsOn(frontendInstall)

        inputs.property("publicUrl", publicUrl)
        inputs.files(fileTree(frontendProjectDir) {
            exclude(".cache", "dist", "node_modules")
        })
        outputs.dir("$frontendProjectDir/dist")

        doFirst {
            frontendDistDir.deleteRecursively()
        }
    }

    processResources {
        dependsOn(frontendBuild)
    }

    withType<Jar> {
        manifest {
            attributes(
                mapOf(
                    "Main-Class" to application.mainClassName
                )
            )
        }
    }

    register("stage") {
        dependsOn("shadowJar")

        doLast {
            delete(
                fileTree("build/classes"),
                fileTree("build/distributions"),
                fileTree("build/kotlin"),
                fileTree("build/resources"),
                fileTree("build/scripts"),
                fileTree("build/tmp")
            )
        }
    }

    register("deployAssets") {
        dependsOn("frontendBuild")

        val wwwRoot = "/var/www/app-konyv"

        doLast {
            ssh.runSessions {
                session(itsy) {
                    execute("rm -rf $wwwRoot/*")
                    put(fileTree(frontendDistDir), wwwRoot)
                }
            }
        }
    }
}


fun Service.runSessions(action: RunHandler.() -> Unit) =
    run(delegateClosureOf(action))

fun RunHandler.session(vararg remotes: Remote, action: SessionHandler.() -> Unit) =
    session(*remotes, delegateClosureOf(action))

fun SessionHandler.put(from: Any, into: Any) =
    put(hashMapOf("from" to from, "into" to into))
