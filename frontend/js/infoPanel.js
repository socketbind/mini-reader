import React from 'react';

export class InfoPanel extends React.Component {

    render() {
        return (<div className={`info-panel ${!!this.props.show ? "show" : ""}`}>
            <button className="close icon" onClick={() => this.props.onClose && this.props.onClose()}></button>

            <h1>Szervusz!</h1>
            <p>
                A Könyv Site egy non-profit kezdeményezés azért, hogy könnyebben jussanak klasszikusok olvasók kezébe,
                egy zsebkönyvhöz hasonlító élményt nyújtva.
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
        </div>)
    }

}