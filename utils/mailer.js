const Hashids = require("hashids");
const nunjucks = require("nunjucks");
const juice   = require("juice");
const fs      = require("fs");

const sendgrid = require("@sendgrid/mail");

const eventHashids = new Hashids(
  process.env.HASHIDS_EVENT_SALT,
  process.env.HASHIDS_EVENT_LENGTH,
  process.env.HASHIDS_EVENT_ALPHABET
);
const creatorHashids = new Hashids(
  process.env.HASHIDS_CREATOR_SALT,
  process.env.HASHIDS_CREATOR_LENGTH
);

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

function sendVerification(creator, event) {

  sendgrid.send({
    to: creator.email,
    from: "noreply@whenisgucci.com",
    subject: "WhenIsGucci: Email Verification Required",
    html: nunjucks.renderString(
      juice(
        fs.readFileSync("views/email/verify-email.njk").toString()
      ),
      {
        authToken: creator.token,
        authHash: creatorHashids.encode(creator.id),
        eventID: eventHashids.encode(event.id)
      }
    )
  });
}

function sendCreated(creator, event) {

  sendgrid.send({
    to: creator.email,
    from: "noreply@whenisgucci.com",
    subject: "WhenIsGucci: Event Created",
    html: nunjucks.renderString(
      juice(
        fs.readFileSync("views/email/event-created.njk").toString()
      ),
      {
        eventTitle: event.title,
        eventCode: eventHashids.encode(event.id)
      }
    )
  });
}

function sendInvites(event) {

  sendgrid.sendMultiple({
    to: event.invitedTo,
    from: "noreply@whenisgucci.com",
    subject: "WhenIsGucci: Event Invitation",
    html: nunjucks.renderString(
      juice(
        fs.readFileSync("views/email/event-invited.njk").toString()
      ),
      {
        eventCode: eventHashids.encode(event.id)
      }
    )
  });

}

module.exports = {
  sendVerification,
  sendCreated,
  sendInvites
};
