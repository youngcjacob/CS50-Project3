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
  if (reply.sender != null) {
  document.querySelector('#compose-recipients').value = reply.sender;
  document.querySelector('#compose-subject').value = 'Re: ' + reply.subject;
  document.querySelector('#compose-body').value = 'On ' + reply.timestamp + " " + reply.sender + " wrote: " + reply.body;
  }
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //passes the desired mailbox to a function to get all the emails for that mailbox type
  get_emails(mailbox);
}

//_ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _
//ALL CODE BEYOND THIS POINT WAS WRITTEN BY ME
  
//This function gets all the emails for the mailbox type and passes those emails to the correct function to display them
//OPTIONAL - move this inside of load_mailbox function
function get_emails(mailbox) {

  const url = mailbox
  fetch(`/emails/${url}`)
  .then(response =>
    response.json())
  .then(emails => { 
    if (mailbox == 'sent') {
      display_sent(emails)
    }
    else if (mailbox == 'inbox') {
      display_inbox(emails)
    }
    else if (mailbox == 'archive') {
      display_archived(emails)
    }
    console.log('resolved', emails);
  });
  return false;  
}

//This function displays all sent emails
function display_sent(emails) {

  emails.forEach(element => {
    const add_div = document.createElement('div');
    //insert if statement, if the email is read then class name should be 'read'
    add_div.className = 'sent-email'
    add_div.innerHTML = `Element ID: ${element.id} <br> Element Body: ${element.body} <br> Element Body: ${element.sender}`;
    add_div.addEventListener('click', function() {single_email_details(element)});
    //add_div.addEventListener('click', single_email_details(element)); -- currently auto-clicking. Not good
    document.querySelector('#emails-view').append(add_div);
    });
}
//this function displays all received emails and highlights the read emails in grey
function display_inbox(emails) {

  emails.forEach(element => {
    const add_div = document.createElement('div');
    //insert if statement, if the email is read then class name should be 'read'
    if (element.read === true) {
      add_div.className = 'read-email'
    }
    else {
      add_div.className = 'unread-email'
    }
    add_div.innerHTML = `<strong>${element.sender}</strong> ${element.subject} ${element.timestamp}`; //<span style="text-align:right;">TEXT</span>
    add_div.addEventListener('click', function() {
      single_email_details(element);
      read(element);
    });
    //add_div.addEventListener('click', single_email_details(element)); -- currently auto-clicking. Not good
    document.querySelector('#emails-view').append(add_div);
    });
  }

//This function displays the archived emails
function display_archived(emails) {

  //this will display only the emails that are archived
  emails.forEach(element => {
    if (element.archive = true) {
      const add_div = document.createElement('div');
      add_div.className = 'sent-email'
      add_div.innerHTML = `Element ID: ${element.id} <br> Element Body: ${element.body}`;
      add_div.addEventListener('click', function() {single_email_details(element)});
      //add_div.addEventListener('click', single_email_details(element)); -- currently auto-clicking. Not good
      document.querySelector('#emails-view').append(add_div);
    }
  });
  return false;
}

//this function displays details for a single email
function single_email_details(email_id) {
  document.querySelector('#emails-view').innerHTML = `<h3></h3>`; //resets the page title to blank 
  const add_div = document.createElement('div');
  add_div.className = 'sent-email' //**update this to change format of single email at later point**
  let archive_button = 'Archive?';
  if (email_id.archived === true) {
    archive_button = 'Unarchive?'
  }

  add_div.innerHTML = 
    `<strong>From:</strong> ${email_id.sender} <br>
    <strong>To:</strong> ${email_id.recipients} <br>
    <strong>Subject:</strong> ${email_id.subject}  <br>
    <strong>Timestamp:</strong> ${email_id.timestamp} <br>
    <button class="btn btn-sm btn-outline-primary" id="reply">Reply</button>
    <button class="btn btn-sm btn-outline-primary" id="archive">${archive_button}</button><br>
    <hr>
    ${email_id.body}
    `;
  
  add_div.querySelector('#reply').addEventListener('click', function() {
    compose_email(email_id)});

  add_div.querySelector('#archive').addEventListener('click', function() {
    archive_unarchive(email_id)})
   
  document.querySelector('#emails-view').append(add_div);

  return false;
}

function archive_unarchive(email) {
  let archived_status = email.archived;
  if (email.archived == false) {
    archived_status = true
  }
  else {
    archived_status = false
  }
  const email_id = email.id
  const status = {archived: archived_status}
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify(
        status
    )
  })
  .then(response => load_mailbox('inbox'))
  return false;
  
}

//this function is to update the email to read once it has been clicked
function read(email) {
  const email_id = email.id
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  })
  return false;
}

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
      load_mailbox('sent');
    });
  // passes the function get_emails the value of 'sent', which will render the sent emails in the webpage
    return false;
  }

//Tasks to be complete________________________________________________________________________________________________________
  //hide archive from sent mailbox
