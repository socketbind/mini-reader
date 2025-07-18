package site.konyv.server

import com.fasterxml.jackson.databind.SerializationFeature
import com.github.mustachejava.DefaultMustacheFactory
import io.ktor.application.Application
import io.ktor.application.call
import io.ktor.application.install
import io.ktor.client.HttpClient
import io.ktor.client.features.HttpTimeout
import io.ktor.client.features.cache.HttpCache
import io.ktor.client.features.cache.storage.HttpCacheStorage
import io.ktor.client.features.json.JacksonSerializer
import io.ktor.client.features.json.JsonFeature
import io.ktor.client.features.logging.LogLevel
import io.ktor.client.features.logging.Logging
import io.ktor.client.request.get
import io.ktor.features.CachingHeaders
import io.ktor.features.ConditionalHeaders
import io.ktor.features.ContentNegotiation
import io.ktor.features.StatusPages
import io.ktor.http.CacheControl
import io.ktor.http.ContentType
import io.ktor.http.content.CachingOptions
import io.ktor.http.content.resources
import io.ktor.http.content.static
import io.ktor.http.contentType
import io.ktor.jackson.jackson
import io.ktor.mustache.Mustache
import io.ktor.mustache.MustacheContent
import io.ktor.request.host
import io.ktor.response.respond
import io.ktor.routing.get
import io.ktor.routing.routing

fun main(args: Array<String>): Unit =
        io.ktor.server.netty.EngineMain.main(args)

@Suppress("unused") // Referenced in application.conf
fun Application.module() {
    val client = HttpClient() {
        install(HttpTimeout) {
        }
        install(JsonFeature) {
            serializer = JacksonSerializer()
        }
        install(Logging) {
            level = LogLevel.HEADERS
        }
        install(HttpCache) {
            privateStorage = HttpCacheStorage.Disabled
            publicStorage = HttpCacheStorage.Unlimited()
        }
    }

    install(Mustache) {
        mustacheFactory = DefaultMustacheFactory("frontend")
    }

    install(ContentNegotiation) {
        jackson {
            enable(SerializationFeature.INDENT_OUTPUT)
        }
    }

    install(ConditionalHeaders)

    install(CachingHeaders) {
        val aggressiveCacheTypes = setOf(
            ContentType.Text.CSS,
            ContentType.Text.JavaScript,
            ContentType.Image.SVG,
            ContentType.Image.PNG,
            ContentType.Image.JPEG
        )

        options { outgoingContent ->
            outgoingContent.contentType?.withoutParameters()
                .takeIf { it in aggressiveCacheTypes }
                .let {
                    CachingOptions(CacheControl.MaxAge(maxAgeSeconds = 31 * 24 * 60 * 60))
                }
        }
    }

    val hostRegex = Regex("^([^.]+)\\.konyv\\.site\$")
    val webManifestPath = "/site.webmanifest"

    suspend fun retrieveBookManifest(forHost: String): Map<String, Any> {
        val ebookId = hostRegex.matchEntire(forHost)?.let { it.groups[1]?.value } ?: "moby-dick"
        val bookManifestUrl = "https://content.konyv.site/$ebookId/book.json"

        return client.get(bookManifestUrl) {
            contentType(ContentType.Application.Json)
        }
    }

    routing {
        static("/") {
            resources("frontend")
        }

        get("/") {
            val model = retrieveBookManifest(context.request.host()) + ("webManifestPath" to webManifestPath)
            call.respond(MustacheContent("index.hbs.html", model))
        }

        get(webManifestPath) {
            val bookProperties = retrieveBookManifest(context.request.host())
            val webManifest = bookProperties["manifest"]
            call.respond(webManifest ?: emptyMap<String, Any>())
        }

        install(StatusPages) {
            /*exception<AuthenticationException> { cause ->
                call.respond(HttpStatusCode.Unauthorized)
            }*/
        }
    }
}
