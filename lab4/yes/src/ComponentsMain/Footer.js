import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link as MuiLink,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import PinterestIcon from "@mui/icons-material/Pinterest";
import YouTubeIcon from "@mui/icons-material/YouTube";

const StyledFooter = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(6, 0),
  marginTop: "auto",
}));

const FooterLink = styled(MuiLink)(({ theme }) => ({
  color: theme.palette.text.secondary,
  textDecoration: "none",
  transition: "color 0.3s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
  },
}));

const SocialIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    color: theme.palette.primary.main,
    transform: "translateY(-2px)",
  },
}));

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const footerSections = [
    {
      title: "About Us",
      links: [
        { text: "Our Story", path: "/about" },
        { text: "Careers", path: "/careers" },
        { text: "Press", path: "/press" },
        { text: "Blog", path: "/blog" },
      ],
    },
    {
      title: "Customer Service",
      links: [
        { text: "Contact Us", path: "/contact" },
        { text: "Shipping", path: "/shipping" },
        { text: "Returns", path: "/returns" },
        { text: "FAQ", path: "/faq" },
      ],
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", path: "/privacy" },
        { text: "Terms of Service", path: "/terms" },
        { text: "Cookie Policy", path: "/cookies" },
        { text: "Sitemap", path: "/sitemap" },
      ],
    },
  ];

  const socialLinks = [
    { icon: <FacebookIcon />, url: "https://facebook.com" },
    { icon: <InstagramIcon />, url: "https://instagram.com" },
    { icon: <TwitterIcon />, url: "https://twitter.com" },
    { icon: <PinterestIcon />, url: "https://pinterest.com" },
    { icon: <YouTubeIcon />, url: "https://youtube.com" },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">OPTIC</div>
        <p className="footer-description contact-description">
          Your trusted destination for premium eyewear. We combine style, comfort, and innovation to bring you the perfect pair of glasses.
        </p>
        <div className="footer-grid">
          <div className="footer-section">
            <h3>About Us</h3>
            <ul className="footer-links">
              <li><Link to="/about">Our Story</Link></li>
              <li><Link to="/careers">Careers</Link></li>
              <li><Link to="/press">Press</Link></li>
              <li><Link to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/shipping">Shipping</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Legal</h3>
            <ul className="footer-links">
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Service</Link></li>
              <li><Link to="/cookie">Cookie Policy</Link></li>
              <li><Link to="/sitemap">Sitemap</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Connect With Us</h3>
            <ul className="footer-links">
              <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
              <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
