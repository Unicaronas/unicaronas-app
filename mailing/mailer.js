import nodemailer from 'nodemailer'
import fs from 'fs'
import consola from 'consola'
import mustache from 'mustache'
import inlineCss from 'inline-css'

function loadFile(template, type) {
    let file = fs.readFileSync(
        __dirname + '/emails/' + template + '/' + type + '.' + type,
        'utf8'
    )
    return file
}

function compileTemplate(data, template) {
    let html_template = loadFile(template, 'html')
    let txt_template = loadFile(template, 'txt')
    let style = fs.readFileSync(__dirname + '/css/style.css')
    data['style'] = style

    let html = mustache.render(html_template, data)
    let text = mustache.render(txt_template, data)
    return {
        html: html,
        text: text
    }
}

async function sendEmail(
    template,
    to,
    subject,
    title,
    subtitle,
    description,
    project_name,
    actionName,
    actionUrl
) {
    let account
    if (process.env.NODE_ENV === 'development') {
        account = await nodemailer
            .createTestAccount()
            .then(account => {
                return account
            })
            .catch(error => {
                return null
            })
    }
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER || account.user,
            pass: process.env.EMAIL_PASSWORD || account.pass
        }
    })
    let data = {
        title: title,
        subtitle: subtitle,
        description: description,
        project_name: project_name,
        actionName: actionName,
        actionUrl: actionUrl
    }
    let body = await compileTemplate(data, template)
    body.html = await inlineCss(body.html, {
        url: 'https://app.unicaronas.com'
    })
        .then(html => {
            return html
        })
        .catch(error => {
            return body.html
        })
    let mailOptions = {
        from:
            '"' +
            process.env.EMAIL_FROM +
            '" <' +
            process.env.EMAIL_FROM_ADDRESS +
            '>',
        to: to,
        subject: subject,
        text: body.text,
        html: body.html
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            consola.error('Failed to send email', error)
        }
        consola.success('Message sent:', info.messageId)
        consola.info('Sent to:', to)
        consola.info('Preview URL:', nodemailer.getTestMessageUrl(info))
        // Preview only available when sending through an Ethereal account

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    })
}

function actionEmail({
    to,
    subject,
    title,
    subtitle,
    description,
    actionName,
    actionUrl
}) {
    let project_name = process.env.APP_NAME
    sendEmail(
        'action',
        to,
        subject,
        title,
        subtitle,
        description,
        project_name,
        actionName,
        actionUrl
    )
}

function basicEmail({ to, subject, title, subtitle, description }) {
    let project_name = process.env.APP_NAME
    sendEmail('basic', to, subject, title, subtitle, description, project_name)
}

export { actionEmail, basicEmail }
