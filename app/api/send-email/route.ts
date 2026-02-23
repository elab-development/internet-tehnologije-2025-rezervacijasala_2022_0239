import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { to, subject, html } = await req.json();

    const data = await resend.emails.send({
      from: 'Ljubičica <onboarding@resend.dev>',
      to: to,
      subject: subject,
      html: html,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Greška pri slanju mejla' }, { status: 500 });
  }
}