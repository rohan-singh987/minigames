const Footer = () => {
  return (
    <footer style={{ padding: '1rem', backgroundColor: '#f0f0f0', textAlign: 'center', color:"#000" }}>
      © {new Date().getFullYear()} Minigames. All rights reserved.
    </footer>
  );
};

export default Footer;