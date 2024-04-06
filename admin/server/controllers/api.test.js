const nodemailer = require("nodemailer");
jest.mock("nodemailer");

describe("contactUs", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "John",
        email: "john@example.com",
        number: "1234567890",
        message: "Hello",
      },
    };
    res = {
      send: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send email with correct details", async () => {
    const sendMailMock = jest.fn().mockImplementation((options, callback) => {
      expect(options.from).toBe("moeezkhattak86@gmail.com");
      expect(options.to).toBe("SWC_Admin_Acc@protonmail.com");
      expect(options.subject).toBe("Contact Us Message");
      expect(options.text).toBe(
        `Name: ${req.body.name}\nPhone Number: ${req.body.number}\nEmail: ${req.body.email}\nMessage: ${req.body.message}`
      );
      callback(null, { response: "Email sent" });
    });

    nodemailer.createTransport.mockImplementation(() => {
      return {
        sendMail: sendMailMock,
      };
    });

    const { contactUs } = require("./adminController");

    await contactUs(req, res);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith("Email sent: Email sent");
  });

  test("should handle error when sending email fails", async () => {
    const sendMailMock = jest.fn().mockImplementation((options, callback) => {
      callback(new Error("Error sending email"), null);
    });

    nodemailer.createTransport.mockImplementation(() => {
      return {
        sendMail: sendMailMock,
      };
    });

    const { contactUs } = require("./adminController");

    await contactUs(req, res);

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith("error");
  });
});