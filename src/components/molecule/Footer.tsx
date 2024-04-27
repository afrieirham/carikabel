import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-screen-lg pb-16">
        <nav className="flex justify-center gap-4" aria-label="Footer">
          <div className="pb-6">
            <a
              target="_blank"
              href="mailto:afrie@kerja-it.com"
              className="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >
              Email
            </a>
          </div>
          <div className="pb-6">
            <a
              target="_blank"
              href="https://x.com/afrieirham_"
              className="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >
              Twitter
            </a>
          </div>
          <div className="pb-6">
            <a
              target="_blank"
              href="https://t.me/afrieirham"
              className="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >
              Telegram
            </a>
          </div>
          <div className="pb-6">
            <Link
              href="/#apply-as-referrer"
              className="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >
              Apply as referrer
            </Link>
          </div>
        </nav>

        <p className="text-center text-xs leading-5 text-gray-500">
          &copy; {new Date().getFullYear()} CariKabel.com, All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
