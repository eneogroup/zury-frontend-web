import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, formation, message } = body;

    // Validation des champs requis
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Les champs nom, email et message sont requis.' },
        { status: 400 }
      );
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Email invalide.' },
        { status: 400 }
      );
    }

    // Template HTML de l'email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #1e40af; margin-bottom: 5px; }
            .value { background: white; padding: 10px; border-radius: 5px; border-left: 3px solid #06b6d4; }
            .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📧 Nouveau Message - Eneo Academy</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Demande de contact via ZURY</p>
            </div>
            
            <div class="content">
              <div class="field">
                <div class="label">👤 Nom complet</div>
                <div class="value">${name}</div>
              </div>

              <div class="field">
                <div class="label">📧 Email</div>
                <div class="value"><a href="mailto:${email}" style="color: #1e40af;">${email}</a></div>
              </div>

              ${phone ? `
                <div class="field">
                  <div class="label">📞 Téléphone</div>
                  <div class="value"><a href="tel:${phone}" style="color: #1e40af;">${phone}</a></div>
                </div>
              ` : ''}

              ${formation ? `
                <div class="field">
                  <div class="label">🎓 Formation d'intérêt</div>
                  <div class="value">${formation}</div>
                </div>
              ` : ''}

              <div class="field">
                <div class="label">💬 Message</div>
                <div class="value" style="white-space: pre-wrap;">${message}</div>
              </div>
            </div>

            <div class="footer">
              <p>Ce message a été envoyé depuis le formulaire de contact Eneo Academy sur <strong>ZURY</strong></p>
              <p>Date: ${new Date().toLocaleString('fr-FR', { timeZone: 'Africa/Brazzaville' })}</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Envoyer l'email via Resend
    const data = await resend.emails.send({
      from: 'ZURY - Eneo Academy <onboarding@resend.dev>', // Email par défaut de Resend (à changer après vérification du domaine)
      to: ['eneogroup.cg@gmail.com'],
      replyTo: email, // Permet de répondre directement à l'utilisateur
      subject: `📧 Nouveau contact Eneo Academy - ${name}`,
      html: htmlContent,
    });

    console.log('Email envoyé avec succès:', data);

    // Email de confirmation à l'utilisateur
    await resend.emails.send({
        from: 'Eneo Academy <onboarding@resend.dev>',
        to: [email],
        subject: '✅ Votre message a bien été reçu - Eneo Academy',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #1e40af 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                </style>
            </head>
            <body>
                <div class="container">
                <div class="header">
                    <h1 style="margin: 0;">✅ Message bien reçu !</h1>
                </div>
                <div class="content">
                    <p>Bonjour <strong>${name}</strong>,</p>
                    <p>Nous avons bien reçu votre message et nous vous remercions de votre intérêt pour Eneo Academy.</p>
                    <p>Notre équipe vous répondra dans les plus brefs délais (généralement sous 24-48h).</p>
                    <p>À très bientôt !</p>
                    <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                    <strong>Eneo Academy</strong><br>
                    Centre de formation en Informatique<br>
                    Brazzaville, République du Congo
                    </p>
                </div>
                </div>
            </body>
            </html>
        `,
    });

    return NextResponse.json({
      success: true,
      message: 'Message envoyé avec succès !',
    });

  } catch (error: any) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.' 
      },
      { status: 500 }
    );
  }
}