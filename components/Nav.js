import Link from 'next/link';

const Nav = () => {
  return (
    <nav style={{ padding: '1rem', backgroundColor: '#f0f0f0', color:"#000" }}>
      <Link href="/">
        <a style={{ marginRight: '1rem' }}>Home</a>
      </Link>
      <Link href="/about">
        <a>About</a>
      </Link>
    </nav>
  );
};

export default Nav;