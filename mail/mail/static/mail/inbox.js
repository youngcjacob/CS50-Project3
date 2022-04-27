document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // send email function call
  document.querySelector('#compose-form').onsubmit = send_email;
  
  // By default, load the inbox
  load_mailbox('inbox')
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // will need to insert if statements to direct to the correct mailbox depending on what the user is triyng to see
  //if mailbox = 'sent'
      //display sent mailbox 
  //elif mailbox = 'inbox'
      //display inbox 
  
  //start with displaying all emails in the general inbox
  get_emails(mailbox);
}

  // Code added as part of the project
  
function send_email() {
  let recipient = document.querySelector('#compose-recipients').value;
  let subject = document.querySelector('#compose-subject').value; 
  let body = document.querySelector('#compose-body').value;

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipient,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(data => {
      load_mailbox('sent');});
  // show the sent mailbox
   return false;

  }



function get_emails(mailbox) {
  const url = mailbox
  fetch(`/emails/${url}`)
  .then(response =>
    response.json())

  .then(emails => { 
  console.log('resolved', emails)
  });

  

  return false;  




}


// emails.forEach(element => { document.querySelector('#emails-view').append('test'); 
  //   })
   
  // });
  // for each email
  // list the title - also have a hyperlink to the specific email 
  // list the subject
  // list the body
