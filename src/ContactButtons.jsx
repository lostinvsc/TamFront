import React from "react";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa"; // Import icons from react-icons

const ContactButtons = () => {
  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-3 z-50">
      <a
        href="https://wa.me/919366794921" // Replace with your WhatsApp number
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-600 border hover:bg-green-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center sm:p-3 md:p-2 lg:p-2"
      >
        <FaWhatsapp size={16} className="sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {/* Larger icon size on mobile */}
      </a>
      <a
        href="tel:+919366794921" // Replace with your phone number
        className="bg-blue-600 border hover:bg-blue-700 text-white p-2 rounded-full shadow-lg flex items-center justify-center sm:p-3 md:p-2 lg:p-2"
      >
        <FaPhoneAlt size={16} className="sm:w-6 sm:h-6 md:w-5 md:h-5 lg:w-6 lg:h-6" /> {/* Larger icon size on mobile */}
      </a>
    </div>
  );
};

export default ContactButtons;
