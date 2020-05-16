

export function ErrorMessage({ error }) {
    let message = '';
    const status = (error && error.response && error.response.status) || 0;
    switch (status) {
        case 403:
            message = 'Du har ikke adgang til dette indhold. Log ind igen for at fortsætte';
            break;
        case 404:
            message = 'Vi beklager men det indhold du forsøgte at hente findes ikke længere.';
            break;
        case 500:
            message = 'Der er desværre sket en fejl på serveren. Prøv igen.';
            break;
        default:
            message = 'Der er sket en fejl. Vi kunne ikke hente det indhold du ønskede';
            break;
    }

    return <div>
        {message}
    </div>
}