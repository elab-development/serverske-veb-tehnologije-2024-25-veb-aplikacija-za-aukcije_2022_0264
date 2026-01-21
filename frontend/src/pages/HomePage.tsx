import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthNavigation from "../components/AuthNavigation";
import Button from "../components/Button";
import Footer from "../components/Footer";
import "../styles/homepage.css";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <AuthNavigation />
      <div className="hero">
        <div className="hero-content-wrap">
          <img src="../images/homepage/hero.png" alt="Hero" className="hero-image" />
          <div className="hero-content">
            <img src="../images/logo/logo-black.png" alt="Hero" className="hero-logo" />
            <h1 className="h50">Dobrodosli na platformu za online aukcije</h1>
            <p className="p18">Pristupite aukcijama, upravljajte ponudama i pratite njihov status u okviru centralizovanog informacionog sistema.</p>
            <Button
              variant="secondary"
              onClick={() => navigate("/active-auctions")}
            >
              Zapocni
            </Button>
          </div>
        </div>
      </div>
      <div className="section">
        <div className="section-wrapper">
          <div className="section-top">
            <div className="vertical">
              <h2 className="h50">Sta je zapravo nasa aplikacija?</h2>

            </div>
            <p className="p20">Naša aplikacija je informacioni sistem razvijen sa ciljem digitalizacije aukcijskog procesa. Omogućava registrovanim korisnicima efikasno učestvovanje u aukcijama, evidenciju ponuda i jasan uvid u rezultate aukcija, uz primenu savremenih veb tehnologija.</p>
          </div>
          <div className="section-bottom">
            <div className="sponsors">
              <img src="../images/sponsors/react.png" alt="react" className="sponsor-image"></img>
              <img src="../images/sponsors/typescript.png" alt="typescript" className="sponsor-image"></img>
              <img src="../images/sponsors/docker.png" alt="docker" className="sponsor-image2"></img>
              <img src="../images/sponsors/laravel.png" alt="laravel" className="sponsor-image"></img>
              <img src="../images/sponsors/mysql.png" alt="mysql" className="sponsor-image"></img>
              <img src="../images/sponsors/github.png" alt="github" className="sponsor-image"></img>
            </div>
            <p>Nasi sponzori</p>
          </div>
          <div className="section-middle">
            <div className="grid-block">
              <img src="../images/homepage/section-homepage.png" alt="grid-background" className="grid-background"></img>
              <div className="grid-content">
                <p className="p15">Sigurno i transparentno</p>
                {/*<p className="p18 left">Sve aukcije su javne, sa jasnim pravilima i potpunom istorijom ponuda. Bez skrivenih koraka i nejasnih ishoda.</p>*/}
              </div>
            </div>
            <div className="grid-block2">

              <div className="grid-content">
                <p className="p15-white">Reaguj u pravom trenutku. </p>
                <p className="p18-left-white">Svaka nova aukcija je odmah vidljiva svim učesnicima.</p>
              </div>
            </div>
            <div className="grid-block2">

              <div className="grid-content">
                <p className="p15-white">Kreiraj svoju ponudu</p>
                <p className="p18-left-white">Sve ostalo sistem automatski vodi, jednostavno i brzo.</p>
              </div>
            </div>
          </div>

        </div>
      

      </div>
      <Footer
        
      />
    </>
  );
};

export default HomePage;


