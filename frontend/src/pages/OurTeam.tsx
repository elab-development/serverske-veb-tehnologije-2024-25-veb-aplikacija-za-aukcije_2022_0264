import { useRef } from "react";
import "../styles/ourteam.css";
import AuthNavigation from "../components/AuthNavigation";
import Footer from "../components/Footer";

type TeamMember = {
    id: "jovana" | "ksenija" | "nevena";
    name: string;
    role?: string;
    image: string;
    bio: string;
    skills: string[];
    contact?: { label: string; value: string }[];
};

const TEAM: TeamMember[] = [
    {
        id: "jovana",
        name: "Jovana Pavicevic",
        image: "/images/team/jovana.jpeg",
        role: "Full-Stack developer & UX/UI design",
        bio:
            "Bavi se razvojem full-stack rešenja i dizajnom korisničkog iskustva. Fokus na čist UI, performanse i stabilan backend.",
        skills: ["React + TypeScript", "Laravel", "UI/UX", "API integracije"],
        contact: [
            { label: "Email", value: "jovana@mail.com" },
            { label: "LinkedIn", value: "linkedin.com/jovana" },
        ],
    },
    {
        id: "ksenija",
        name: "Ksenija Nikic",
        image: "/images/team/ksenija.jpeg",
        role: "Full-Stack developer & Marketing",
        bio:
            "Spaja development i marketing: gradi funkcionalnosti koje prate ciljeve rasta, SEO i analitiku.",
        skills: ["React", "Laravel", "SEO", "Content/Marketing"],
        contact: [
            { label: "Email", value: "ksenija@mail.com" },
            { label: "LinkedIn", value: "linkedin.com/ksenija" },
        ],
    },
    {
        id: "nevena",
        name: "Nevena Nedeljkovic",
        image: "/images/team/nevena.jpeg",
        role: "Full-Stack developer & Project manager",
        bio:
            "Vodi projekat i isporuku: planiranje, koordinacija i kvalitet. Fokus na organizaciju i pouzdanu implementaciju.",
        skills: ["Planiranje", "Komunikacija", "Full-stack", "QA / testiranje"],
        contact: [{ label: "Email", value: "nevena@mail.com" },{ label: "LinkedIn", value: "linkedin.com/nevena" },],
    },
];

export default function OurTeamPage() {
    
    const detailRefs = useRef<Record<string, HTMLElement | null>>({});

    const setDetailRef = (id: string) => (el: HTMLElement | null) => {
        detailRefs.current[id] = el;
    };

    const scrollToMember = (id: string) => {
        const el = detailRefs.current[id];
        if (!el) return;

        
        const y = el.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <>
            <AuthNavigation mode="dark" />

            <main className="ourteam">
                <section className="ourteam__section">
                    <div className="ourteam__header">
                        <h1 className="ourteam__title">Our Team</h1>
                    </div>

                    <div className="ourteam__grid">
                        {TEAM.map((m) => (
                            <article
                                key={m.id}
                                className="ourteam__card ourteam__card--click"
                                role="button"
                                tabIndex={0}
                                onClick={() => scrollToMember(m.id)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") scrollToMember(m.id);
                                }}
                            >
                                <div className="ourteam__imageWrap">
                                    <img className="ourteam__img" src={m.image} alt={m.name} />
                                </div>

                                <div className="ourteam__meta">
                                    <p className="ourteam__name">{m.name}</p>
                                    {m.role && <p className="ourteam__role">{m.role}</p>}
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

               
                <div className="marquee">
                    <div className="marquee__track">
                        <span>Inovativni</span>
                        <span>·</span>
                        <span>Pouzdani</span>
                        <span>·</span>
                        <span>Kreativni</span>

                        <span>Inovativni</span>
                        <span>·</span>
                        <span>Pouzdani</span>
                        <span>·</span>
                        <span>Kreativni</span>
                    </div>
                </div>

               
                <section className="team-details">
                    <h2 className="team-details__title">Ko stoji iza BidX</h2>

                    <div className="team-details__list">
                        {TEAM.map((m) => (
                            <section
                                key={m.id}
                                ref={setDetailRef(m.id)}
                                className="team-details__card"
                            >
                                <div className="team-details__top">
                                    <img className="team-details__avatar" src={m.image} alt={m.name} />
                                    <div>
                                        <h3 className="team-details__name">{m.name}</h3>
                                        {m.role && <p className="team-details__role">{m.role}</p>}
                                    </div>
                                </div>

                                <p className="team-details__bio">{m.bio}</p>

                                <div className="team-details__row">
                                    <p className="team-details__label">Fokus:</p>
                                    <div className="team-details__tags">
                                        {m.skills.map((s) => (
                                            <span key={s} className="team-details__tag">
                                                {s}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {m.contact?.length ? (
                                    <div className="team-details__contacts">
                                        {m.contact.map((c) => (
                                            <p key={c.label} className="team-details__contact">
                                                <span className="team-details__label">{c.label}:</span> {c.value}
                                            </p>
                                        ))}
                                    </div>
                                ) : null}
                            </section>
                        ))}
                    </div>
                </section>
                <section className="about-auctions">
                    <div className="about-auctions__left">
                        <h2 className="about-auctions__title">
                            Razvijamo i gradimo <br />
                            budućnost online aukcija
                        </h2>

                        <p className="about-auctions__text">
                            Naša platforma za online aukcije spaja moderan dizajn i pouzdan backend kako bi
                            kupovina i licitiranje bili jednostavni, bezbedni i transparentni.
                            Fokusirani smo na odličan korisnički doživljaj, brzu pretragu aukcija, filtriranje,
                            paginaciju i stabilan sistem ponuda u realnom vremenu.
                        </p>

                        <a className="about-auctions__contact" href="mailto:aukcije@prisma.com">
                            <span className="about-auctions__icon" aria-hidden="true">✉</span>
                            <span>onlineaukcije@bidx.com</span>
                        </a>
                    </div>

                    <div className="about-auctions__right">
                        <div className="metric">
                            <div className="metric__head">
                                <span className="metric__label">UX/UI Design</span>
                                <span className="metric__value">85%</span>
                            </div>
                            <div className="metric__bar">
                                <div className="metric__fill" style={{ width: "85%" }} />
                            </div>
                        </div>

                        <div className="metric">
                            <div className="metric__head">
                                <span className="metric__label">Backend stabilnost</span>
                                <span className="metric__value">90%</span>
                            </div>
                            <div className="metric__bar">
                                <div className="metric__fill" style={{ width: "90%" }} />
                            </div>
                        </div>

                        <div className="metric">
                            <div className="metric__head">
                                <span className="metric__label">Performanse & sigurnost</span>
                                <span className="metric__value">88%</span>
                            </div>
                            <div className="metric__bar">
                                <div className="metric__fill" style={{ width: "88%" }} />
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            <Footer />
        </>
    );
}
