export default function generateView(payload: any): string {
    return (`
        <h3>Dear</h3>
        <p>We have received a password reset request for your account. Please use this code <strong>${payload.code}</strong>
        <br><br>
        Alternatively, you can use the link, ${payload.url}
        <br><br>
        PS: If you haven't made any request to reset your password, please try to strengthen the security of your account as someone might be trying to take access.</p>
    `);
}