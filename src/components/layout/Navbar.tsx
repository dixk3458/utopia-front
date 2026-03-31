import { Link } from 'react-router';
import Logo from '../ui/Logo';
import Container from './Container';
import { useEffect, useMemo, useState } from 'react';
import { NavHashLink } from 'react-router-hash-link';
import { IoClose, IoMenu } from 'react-icons/io5';

type SectionId = 'features' | 'security' | 'team';

interface NavItem {
  label: string;
  href: `#${SectionId}`;
  id: SectionId;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('features');

  const navItems: NavItem[] = useMemo(
    () => [
      { label: '핵심 기능', href: '#features', id: 'features' },
      { label: '보안 시스템', href: '#security', id: 'security' },
      { label: '팀 소개', href: '#team', id: 'team' },
    ],
    [],
  );

  const toggleMenu = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id as SectionId);
        }
      },
      {
        root: null,
        rootMargin: '-20% 0px -55% 0px',
        threshold: [0.2, 0.35, 0.5, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [navItems]);

  const getDesktopLinkClass = (id: SectionId) =>
    [
      'relative text-sm font-medium transition-colors',
      activeSection === id
        ? 'text-primary'
        : 'text-gray-600 hover:text-gray-900',
    ].join(' ');

  const getMobileLinkClass = (id: SectionId) =>
    [
      'block px-3 py-2 text-base font-medium rounded-md transition-colors',
      activeSection === id
        ? 'text-primary bg-purple-50'
        : 'text-gray-700 hover:text-primary hover:bg-gray-50',
    ].join(' ');

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <Container className="flex items-center justify-between py-3">
        <Link to="/" className="flex items-center gap-2 group">
          <Logo />
          <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight group-hover:text-primary transition-colors">
            Party-UP
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-3 md:gap-6">
          {navItems.map((item) => (
            <NavHashLink
              key={item.id}
              to={item.href}
              smooth
              className={getDesktopLinkClass(item.id)}
            >
              {item.label}
              <span
                className={[
                  'absolute left-0 -bottom-1 h-0.5 w-full rounded-full bg-primary origin-left transition-transform duration-300',
                  activeSection === item.id ? 'scale-x-100' : 'scale-x-0',
                ].join(' ')}
              />
            </NavHashLink>
          ))}
        </div>

        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className="text-gray-600 hover:text-gray-900 focus:outline-none p-2"
          >
            {isOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </Container>

      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-4 space-y-2 shadow-lg">
          {navItems.map((item) => (
            <NavHashLink
              key={item.id}
              to={item.href}
              smooth
              onClick={toggleMenu}
              className={getMobileLinkClass(item.id)}
            >
              {item.label}
            </NavHashLink>
          ))}
        </div>
      )}
    </nav>
  );
}
