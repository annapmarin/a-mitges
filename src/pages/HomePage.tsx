import { useEffect } from "react";
import { GoogleLoginButton } from "../components/GoogleLoginButton";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Logo from '../assets/logo.svg';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();


  useEffect(() => {
    if (user) {
      navigate('/projectes');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user) {
      gsap.registerPlugin(SplitText);

      const split = new SplitText(".split", {
        type: "words, chars, lines"
      });

      gsap.from(split.lines, {
        rotationX: -100,
        transformOrigin: "50% 50% -160px",
        opacity: 0,
        duration: 0.8, 
        ease: "power3",
        stagger: 0.25
      });

      return () => {
        split.revert();
      };
    }
  });

  if (loading) return null;

  return (
    <section className="home-page">
      <img src={Logo} alt="A mitges logo" className="logo" />
      <h1 className="split">A mitges</h1>
      <span className="split">Divideix i comparteix</span>
      <div className="buttons">
        <GoogleLoginButton />
      </div>
    </section>
  );
}