import { Link } from 'react-router-dom'
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink-900 border-t border-white/[0.06] text-ivory-300">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2
              className="text-white text-xl font-bold mb-3"
              style={{ fontFamily: "'Lora', serif" }}
            >
              WELL<span style={{ color: 'var(--wp-green)' }}>Print</span>
            </h2>

            <p className="text-sm text-ivory-300/40 leading-relaxed">
              Your trusted printing partner for high-quality and reliable print
              solutions. We turn your ideas into professional outputs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">
              Quick Links
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-wp-green transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-wp-green transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-wp-green transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-wp-green transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">
              Customer
            </h3>

            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/track-order"
                  className="hover:text-wp-green transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  to="/cart"
                  className="hover:text-wp-green transition-colors"
                >
                  Cart
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="hover:text-wp-green transition-colors"
                >
                  Browse Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">
              Contact Us
            </h3>

            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-wp-green" />
                <span>Ormoc City, Philippines</span>
              </li>

              <li className="flex items-center gap-2">
                <Phone size={14} className="text-wp-green" />
                <span>+63 9XX XXX XXXX</span>
              </li>

              <li className="flex items-center gap-2">
                <Mail size={14} className="text-wp-green" />
                <span>wellprintormoc@gmail.com</span>
              </li>
            </ul>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-wp-green/20 transition"
              >
                <Facebook size={14} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-wp-green/20 transition"
              >
                <Instagram size={14} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center hover:bg-wp-green/20 transition"
              >
                <Twitter size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/[0.06] mt-10 pt-6 text-center text-xs text-ivory-300/30">
          © {new Date().getFullYear()} WELLPrint. All rights reserved.
        </div>
      </div>
    </footer>
  )
}