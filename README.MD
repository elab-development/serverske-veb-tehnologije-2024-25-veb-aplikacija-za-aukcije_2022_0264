
# Veb aplikacija za online aukcije

Ova aplikacija je full-stack veb aplikacija razvijena koriscenjem React-a sa TypeScript-om na frontend strani i Laravel-a na backend strani, koji funkcionise kao REST API sistem za aukcije. Osnovna svrha aplikacije je da omoguci korisnicima davanje ponuda (bids) na aukcijama, dok administratorima pruza mogucnost upravljanja aukcijama, kao i kreiranja, pregleda, izmene i brisanja kategorija, proizvoda i aukcija, kao i interakciju sa spoljnim aukcijskim API-jevima. Aplikacija je projektovana kao integrisan frontend i backend sistem, sa grafickim korisnickim interfejsom i jasno definisanim endpointima.

Centralni entiteti aplikacije su User, Auction, Product, Bid i Category. Korisnici sistema mogu biti neautentifikovani, regularni (autentifikovani) ili administratori. Administratorske privilegije su neophodne za izvrsavanje odredjenih operacija, kao sto su upravljanje kategorijama i proizvodima, kao i uredjivanje ili brisanje aukcija i izvoz podataka. Svaka aukcija sadrzi osnovne podatke o opisu, pocetnoj ceni, trenutnoj najvisoj ponudi i vremenu trajanja, kao i informacije o proizvodu koji se nalazi na aukciji. Aukcija pripada odredjenom proizvodu i povezana je sa administratorom koji ju je kreirao.

Ponude (bids) predstavljaju kljucni deo sistema - korisnici daju ponude na aukcijama, dok sistem automatski azurira najvisu ponudu i obezbedjuje da svaka nova ponuda mora biti veca od prethodne.

Poseban akcenat stavljen je na kontrolu pristupa i bezbednost sistema. Regularni korisnici imaju uvid iskljucivo u sopstvene ponude, dok administratori imaju mogucnost uvida u sve ponude i aukcije, kao i pristup dodatnim rutama za pregled ponuda po aukciji ili po konkretnom korisniku. Za sve zasticene rute koristi se autentifikacija putem Laravel Sanctum-a, cime se obezbedjuje da samo prijavljeni korisnici mogu pristupati sistemu.

Aplikacija omogucava integraciju sa javno dostupnim aukcijskim API-jevima. Implementirane su rute koje komuniciraju sa spoljnim servisima, kao sto su GSA Auctions API (americke vladine aukcije) i ProZorro / OpenProcurement API (sistem javnih nabavki). Ove rute su dostupne iskljucivo autentifikovanim korisnicima i sluze kao demonstracija povezivanja sistema sa spoljnim servisima.

Kao dodatna funkcionalnost, sistem omogucava izvoz podataka u CSV formatu. Administratori mogu generisati i preuzeti CSV fajl sa podacima o aukcijama, sto omogucava laku integraciju sa eksternim alatima za analitiku ili cuvanje istorijskih podataka. Ova funkcionalnost je implementirana na nacin koji omogucava lako prosirenje i na druge entitete, poput ponuda.

Svi podaci se vracaju u konzistentnom JSON formatu, sto aplikaciju cini pogodnom za dalji razvoj.


## Instalacija

## Preduslovi 
- instaliran Docker Desktop
- instaliran Docker Compose
- instaliran Git
- instaliran Node.js i npm (frontend)
- instaliran Composer (backend)

## Pokretanje aplikacije
- Kloniranje repozitorijuma
```bash
git clone https://github.com/elab-development/serverske-veb-tehnologije-2024-25-veb-aplikacija-za-aukcije_2022_0264.git

```
- U backend-u kreirati .env fajl i prekopirati sadrzaj iz fajla .env.example
- Pokrenuti Docker kontejnere
```bash
docker compose down -v
docker compose up --build

```
- Nakon sto se kontejneri uspesno pokrenu,u drugom terminalu izvrsiti sledece komande
```bash
docker exec -it laravel_app php artisan key:generate
```
- Ovaj korak je obavezan,sluzi za brisanje postojecih tabela u bazi, ponovno izvrsavanje migracija i automatsko popunjavanje baze testnim podacima neophodnih za rad aplikacije
```bash
docker exec -it laravel_app php artisan migrate:fresh --seed
```
- Instalacija frontend (React) paketa lokalno u okviru VS Code-a.
```bash
npm --prefix frontend ci
```
- Instalacija Laravel (backend) zavisnosti lokalno, kako bi VS Code pravilno prepoznao backend pakete
```bash
composer install --no-interaction --prefer-source
```


