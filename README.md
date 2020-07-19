# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar os envios em ambiente dev;
- Utilizar Amazon SES para enviar para produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

- O link de recuperação de senha deve expirar em 2hras;
- O usuário precisa confirmar a nova senha ao resetar sua senha;
