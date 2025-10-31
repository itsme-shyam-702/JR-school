import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/contact";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("Sending...");

      await api.sendMessage(formData);

      // ✅ SweetAlert2 Success Message
      Swal.fire({
        title: " Message Sent!",
        text: "Thank you for reaching out! We’ll get back to you soon.",
        icon: "success",
        showConfirmButton: false,
        timer: 2500,
        background: "#f0f9ff",
        color: "#1e3a8a",
        position: "center",
        showClass: {
          popup: "animate__animated animate__fadeInDown",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOutUp",
        },
      });

      setStatus("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("Failed to send message. Try again.");

      // ❌ SweetAlert2 Error Message
      Swal.fire({
        title: " Oops!",
        text: "Failed to send your message. Please try again later.",
        icon: "error",
        confirmButtonColor: "#ef4444",
        background: "#fff1f2",
        color: "#991b1b",
        showClass: {
          popup: "animate__animated animate__shakeX",
        },
        hideClass: {
          popup: "animate__animated animate__fadeOut",
        },
      });
    }
  };

  return (
    <section className="text-gray-600 body-font relative">
      {/* Google Map Background */}
      <div className="absolute inset-0 bg-gray-300">
        <iframe
          title="Jr Technical School Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3270.4526292970613!2d74.85515908648846!3d12.89192698540115!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35a142daea297%3A0xfb3240042e04f68!2sJr%20Technical%20School%2C%20Bondel%20Rd%2C%20Kadri%20Hills%2C%20Kadri%2C%20Mangaluru%2C%20Karnataka%20575016!5e0!3m2!1sen!2sin!4v1752823252213!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, filter: "grayscale(1) contrast(1.2) opacity(0.4)" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* Form Container */}
      <div className="container px-5 py-24 mx-auto flex">
        <div className="lg:w-1/3 md:w-1/2 bg-white rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0 relative z-10 shadow-lg transition-all duration-300 hover:shadow-2xl">
          <h2 className="text-gray-900 text-lg mb-1 font-medium title-font">Contact Us</h2>
          <p className="leading-relaxed mb-5 text-gray-600">
            Reach out to us for admissions, queries, or a campus visit. We'd love to hear from you!
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="text-sm text-gray-600">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-all duration-200 ease-in-out"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="text-sm text-gray-600">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-all duration-200 ease-in-out"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="text-sm text-gray-600">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                placeholder="Your message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-all duration-200 ease-in-out"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg shadow transition-all duration-300 hover:scale-105"
            >
              Send Message
            </button>

            {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
            <p className="text-xs text-gray-500 mt-3">
              We'll get back to you within 24 hours during working days.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
