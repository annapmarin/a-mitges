import { useEffect } from "react";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
import Logo from '../assets/logo.svg';
import { Button } from "../components/Button";

export default function HomePage() {
  useEffect(() => {
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
  }, []);

  return (
    <section className="home-page">
      <img src={Logo} alt="A mitges logo" className="logo" />
      <h1 className="split">A mitges</h1>
      <span className="split">Divideix i comparteix</span>
      <div className="buttons">
        <Button label="Iniciar sessió" onClick={() => alert('Iniciar sessió')} fullWidth />
        <Button label="Registra't" onClick={() => alert("Registra't")} fullWidth />
      </div>
    </section>
  );
}