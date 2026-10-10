export type SendEmailProps = {
    to: string;
    subject: string;
    html: string;
    /**
     * [CRM-P3] اسم العرض وحده — لا العنوان.
     *
     * الحساب عالميّ واحد، وGmail يعيد كتابة `From` لا يطابق الحساب المُصادَق عليه، فالعنوان
     * يبقى `env.EMAIL_USER` مهما فعلنا. ما يمكن تغييره صدقًا هو الاسم الظاهر، فتُميّز
     * الأكاديميةُ نفسَها به (قرار وليّ الأمر، §17.2 صفّ ١٤).
     */
    fromName?: string | null;
    /** ما يجعل القرار عمليًّا: الردّ يذهب إلى الأكاديمية لا إلى الصندوق العالميّ. */
    replyTo?: string | null;
};
export declare function sendEmail({ to, subject, html, fromName, replyTo }: SendEmailProps): Promise<import("nodemailer/lib/smtp-transport").SentMessageInfo>;
