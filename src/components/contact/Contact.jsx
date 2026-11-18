import { useState } from "react";
import axios from "axios";
import { FiSend } from "react-icons/fi";
import Title from "../home/Title";

const Contact = () => {
  // State variables for form inputs
  const [clientName, setClientName] = useState("");
  const [email, setEmail] = useState("");
  const [messages, setMessages] = useState("");

  // Error state variables for form validation
  const [errClientName, setErrClientName] = useState(false);
  const [errEmail, setErrEmail] = useState(false);
  const [errMessages, setErrMessages] = useState(false);

  // Success message state variable
  const [successMsg, setSuccessMsg] = useState("");

  // Function to validate email format
  const validateEmail = (email) => {
    return String(email).toLowerCase().match(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/);
  };

  // Event handlers for form inputs
  const handleName = (e) => {
    setClientName(e.target.value);
    setErrClientName(false);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
    setErrEmail(false);
  };

  const handleMessages = (e) => {
    setMessages(e.target.value);
    setErrMessages(false);
  };

  // Event handler for sending the form
  const handleSend = (e) => {
    e.preventDefault();

    // Form validation
    if (!clientName) {
      setErrClientName(true);
    }

    if (!email || !validateEmail(email)) {
      setErrEmail(true);
    }

    if (!messages) {
      setErrMessages(true);
    }

    // If all validations pass, send the form data using Axios
    if (clientName && email && validateEmail(email) && messages) {
      axios.post("https://getform.io/f/8ae7d1ce-4542-4b39-8a51-7e7bac9c93fe", {
        name: clientName,
        email: email,
        message: messages,
      });

      // Display success message and reset form inputs
      setSuccessMsg(`Hello ${clientName}, Your message has been sent!`);
      setClientName("");
      setEmail("");
      setMessages("");
    }
  };

  return (
    <div className="w-full">
      {/* Contact Title */}
      <Title title="Get" subTitle="in Touch" />

      {/* Contact Information */}
      <div className="p-4 flex w-full flex-col md:flex-row justify-between gap-4 md:gap-10 lg:gap-20">
        <div className="w-full lg:w-1/2">
          <p className="w-[80%] flex gap-6 justify-between md:w-full text-lg text-[#ccc] py-4 border-b-[1px] border-b-zinc-800">
            <span className="bg-designColor text-gray-700 text-sm font-titleFont font-medium px-2 rounded-md flex items-center justify-center hidden md:block">
              Address:
            </span>
            Hulhumale, Maldives
          </p>
          <p className="flex justify-between w-full text-lg text-[#ccc] py-4 border-b-[1px] border-b-zinc-800">
            <span className="bg-designColor text-gray-700 text-sm font-titleFont font-medium px-2 rounded-md flex items-center justify-center hidden md:block">
              Phone:
            </span>
            +960 9190402
          </p>
        </div>
        <div className="w-full lg:w-1/2">
          <p className="flex justify-between lg:gap-6 w-full text-lg text-[#ccc] py-4 border-b-[1px] border-b-zinc-800">
            <span className="bg-designColor text-gray-700 text-sm font-titleFont font-medium px-2 rounded-md flex items-center justify-center hidden md:block">
              Email:
            </span>
            evaan0202@gmail.com
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="w-full mt-10">
        <Title title="Send" subTitle="Messages" />

        {successMsg ? (
          // Display success message if available
          <p className="text-center text-base font-titleFont p-20 text-designColor">
            {successMsg}
          </p>
        ) : (
          // Display the contact form
          <form
            id="form"
            action="https://getform.io/f/e18ee560-5133-4cfe-9a48-eddb6f012a9f"
            method="POST"
            className="p-6 flex flex-col gap-6"
          >
            {/* Form Inputs */}
            <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-10 justify-between">
              <input
                onChange={handleName}
                value={clientName}
                className={`${
                  errClientName
                    ? "border-red-600 focus-visible:border-red-600"
                    : "border-zinc-600 focus-visible:border-designColor"
                } w-full bg-transparent border-2 px-4 py-2 text-base text-gray-200 outline-none duration-300`}
                type="text"
                placeholder="Full Name"
              />
              <input
                onChange={handleEmail}
                value={email}
                className={`${
                  errEmail
                    ? "border-red-600 focus-visible:border-red-600"
                    : "border-zinc-600 focus-visible:border-designColor"
                } w-full bg-transparent border-2 px-4 py-2 text-base text-gray-200 outline-none duration-300`}
                type="email"
                placeholder="Email Address"
              />
            </div>

            {/* Message Input */}
            <textarea
              onChange={handleMessages}
              value={messages}
              className={`${
                errMessages
                  ? "border-red-600 focus-visible:border-red-600"
                  : "border-zinc-600 focus-visible:border-designColor"
              } w-full bg-transparent border-2 px-4 py-2 text-base text-gray-200 outline-none duration-300 resize-none`}
              placeholder="Your Message"
              rows="4"
            ></textarea>

            {/* Submit Button */}
            <button
              onClick={handleSend}
              className="text-base w-44 flex items-center gap-1 text-gray-200 hover:text-designColor duration-200"
            >
              Send Message{" "}
              <span className="mt-1 text-designColor">
                <FiSend />
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Contact;
