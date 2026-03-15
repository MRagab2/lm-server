// Send a standardized success response

const sendSuccess = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({ message, data });
};


//  Send a standardized error response

const sendError = (res, message = 'Something went wrong', status = 500) => {
  return res.status(status).json({ message });
};

module.exports = { sendSuccess, sendError };