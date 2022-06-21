import { describe } from 'mocha';
import { expect } from 'chai';
import { initializeNotifme } from '@app/helpers/notifmeHelper';
import { PasswordResetRequestNotification } from '@app/notifications/PasswordResetRequest';

initializeNotifme();

describe('Password Reset Request Notification', function() {
    this.timeout(15000);

    it('should successfully send a password reset request via email', async () => {
        const notification = new PasswordResetRequestNotification();
        const result = await notification.mail({
            receiver: {
                email: "test@test.com"
            },
            payload: {
                code: 1234,
                url: 'http://test.com'
            }
        })

        expect(result).to.haveOwnProperty('status', 'success');
    });

    it('should successfully send a password reset request via channels [email]', async () => {
        const notification = new PasswordResetRequestNotification();
        const result = await notification.notify({
            receiver: {
                email: "test@test.com"
            },
            payload: {
                code: 5678,
                url: 'http://test.com'
            }
        });

        expect(result).to.haveOwnProperty('mail');
        expect(result.mail).to.haveOwnProperty('status', 'success');
    });
});