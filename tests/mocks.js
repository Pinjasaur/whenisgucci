module.exports = {
  validEvent: {
    verified: true,
  },
  invalidEvent: {
    verified: false
  },
  validInvitees: [
    "test@example.com",
    "test@example.com",
    "test@example.com"
  ],
  trimInvitees: [
    "  test@example.com     ",
    "       test@example.com",
    "test@example.com       "
  ],
  whitespaceInvitees: [
    "            "
  ]

};
