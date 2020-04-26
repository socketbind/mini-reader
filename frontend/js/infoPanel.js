import React from 'react';
import settingsButton from '../images/ios/settings-button.png';
import addToHomescreenButton from '../images/ios/add-to-homescreen-button.png';

export class InfoPanel extends React.Component {

    render() {
        return (<div className={`info-panel ${!!this.props.show ? "show" : ""}`}>
            {this.props.children}
        </div>)
    }

}

export class GeneralInfoPanel extends React.Component {
    render() {
        return (<InfoPanel {...this.props}>
            <button className="button close icon" onClick={() => this.props.onClose && this.props.onClose()}></button>

            <h1>Szervusz!</h1>
            <p>
                A Könyv Site egy non-profit kezdeményezés azért, hogy könnyebben jussanak klasszikusok olvasók kezébe,
                egy zsebkönyvre emlékeztető élményt nyújtva.
            </p>

            <p>
                Reméljük, hogy az itt megjelent könyvek sok örömet okoznak és tartalmas időtöltést adnak számodra.
            </p>

            <p>
                Ha netán publikálni szeretnél itt, nyugodtan keress <a href="mailto:gabriel@konyv.site">gabriel@konyv.site</a> e-mail címen.
            </p>

            <h5>Köszönetnyilvánítás</h5>
            <ul>
                <li>Borítóképek - Niki</li>
                <li>Indulóképernyő vektor design részletek - <a href="https://www.freepik.com/free-photos-vectors/book">www.freepik.com</a></li>
                <li>Yellosun írott font - <a href="https://fontkong.com/shop/">Font Kong</a></li>
            </ul>
            </InfoPanel>)
    }
}

export class IOSInfoPanel extends React.Component {
    render() {
        return (<InfoPanel {...this.props}>
            <h1>Telepítés iOS-en</h1>

            <p>
            Amennyiben iOS rendszerű készülékén szeretné telepíteni az alkalmazást, azt első lépésben a böngésző (Safari)
            alsó sávjában található beállítások gomb megnyomásávál teheti:
            </p>

            <img src={settingsButton} />

            <p>
            A felugró menüben válassza az "Add to Home Screen" (Hozzáadás a kezdőképernyőhöz) lehetőséget.
            </p>

            <img src={addToHomescreenButton} />

            <p>
                Az alkalmazás elérhetővé lesz a kezdőképernyőn és offline is használhatóvá válik.
            </p>

            </InfoPanel>)
    }
}