import Button from '@/app/landingA/Button';
import { MoveRight } from 'lucide-react';

const Navbar = () => {
  const NavLinks = ['Home', 'About', 'Services', 'Contact'];

  return (
    <header className="relative w-full py-4 px-24 grid grid-cols-3 items-center">
      {/* logo */}
      <h1 className="text-xl font-bold">GCHealth 🦋</h1>

      {/* Links */}
      <ul className="flex gap-3 items-center justify-center cursor-pointer">
        {NavLinks.map((name, key) => (
          <li key={key + name} className="hover:text-green-600">
            {name}
          </li>
        ))}
      </ul>

      {/* button */}
      <Button
        icon
        className="justify-self-end"
        style="primary"
        cursor="pointer"
      >
        Get In Touch <MoveRight size={18} />
      </Button>
    </header>
  );
};

export default Navbar;
