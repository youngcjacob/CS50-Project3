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

function compose_email(reply) {

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
  
  //passes the desired mailbox to a function to get all the emails for that mailbox type
  get_emails(mailbox);
}

//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
//ALL CODE BEYOND THIS POINT WAS WRITTEN BY ME
  
//this function gets all the emails for the mailbox type and passes those emails to the correct function to display them
//OPTIONAL - move this inside of load_mailbox function
function get_emails(mailbox) {
  const url = mailbox
  fetch(`/emails/${url}`)
  .then(response =>
    response.json())

  .then(emails => { 
  console.log('resolved', emails);
  emails.forEach(element => { document.querySelector('#emails-view').append(element.id);
  document.querySelector('#emails-view').append(element.body);
    });
  });

// for each email
  // list the title - also have a hyperlink to the specific email 
  // list the subject
  // list the body  

  return false;  
}


// function display_sent(emails) {}
  //have a for loop displaying all sent emails 
  //will have a hyperlink to bring user to specific email if clicking on the Id


// function display_inbox(emails) {}
  //have a for loop displaying all received emails 
  //will have a hyperlink to bring user to specific email if clicking on the Id

// function single_email_details(email_id) {}
  //Will need to get the contents of single email and display them  
  //Need to show: email's sender, recipients, subject, timestamp, body
  //want to add an additional div to inbox.html for displaying the contents(see the hints section for help)
  //will want to update the email to read once it has been clicked on. Use a put reques to do so  
  // fetch('/emails/100')
  // .then(response => response.json())
  // .then(email => {
  //     // Print email
  //     console.log(email);

  //     // ... do something else with email ...
  // });


// function archive_unarchive(email) {}
  //will pass a single email id into this function and allow the email to be archived or unarchived
  //when viewing a single email, the user should be able to select to archive an email or unarchive the email
  //when the button is clicked, take the user to the email inbox


//This function will send an email to the desired recipient  
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
  // passes the function get_emails the value of 'sent', which will render the sent emails in the webpage
    return false;

  }


// function reply_email(email_id) {}
  //need to add an optional parameter to send email
  //will pass send_email a parameter which will then be used to populate recipient and subject 


//Tasks to be complete after watching User Interface video 
  //Formatting color of read vs unread emails 
