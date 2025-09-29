import profile from '../assets/profile.svg';

export default function Header() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-blue-400/80 w-screen h-16 flex items-center justify-between px-4 shadow-md">
        <div></div>
        <img src={profile} alt="profile" className="w-8 h-8" />
    </div>
  );
}