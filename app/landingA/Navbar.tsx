import Button from '@/app/landingA/Button';
import { MoveRight } from 'lucide-react';

const Navbar = () => {
  const NavLinks = ['Home', 'About', 'Services', 'Contact'];

  return (
    <header className="relative grid w-full grid-cols-3 items-center px-24 py-4">
      {/* logo */}
      <h1 className="text-xl font-bold">GCHealth 🦋</h1>

      {/* Links */}
      <ul className="flex cursor-pointer       items-center justify-center gap-3">
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
