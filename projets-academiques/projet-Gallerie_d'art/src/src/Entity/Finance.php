<?php

namespace App\Entity;

use App\Repository\FinanceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=FinanceRepository::class)
 */
class Finance
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    

    /**
     * @ORM\Column(type="date")
     * @Assert\NotBlank(message="Vérfier la date  ")
     */
    private $date;

    /**
     * @ORM\ManyToOne(targetEntity=Dons::class, inversedBy="totale_dons")
     */
    private $dons;

    /**
     * @ORM\ManyToOne(targetEntity=Evenement::class, inversedBy="totale_evnement")
     */
    private $evenement;

    /**
     * @ORM\ManyToOne(targetEntity=Commande::class, inversedBy="totale")
     */
    private $commande;

   

    /**
     * @ORM\Column(type="integer")
     *   @Assert\NotBlank(message="Vérfier la somme  ")
     */
    private $somme;

    /**
     * @ORM\Column(type="string", length=7)
     */
    private $color1;

    /**
     * @ORM\Column(type="string", length=7)
     */
    private $color2;

    /**
     * @ORM\Column(type="string", length=7)
     */
    private $color3;

    public function __construct()
    {
        $this->totale_stock = new ArrayCollection();
        $this->totale_Dons = new ArrayCollection();
        $this->total_evenement = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, Commande>
     */
    public function getTotaleStock(): Collection
    {
        return $this->totale_stock;
    }

    public function addTotaleStock(Commande $totaleStock): self
    {
        if (!$this->totale_stock->contains($totaleStock)) {
            $this->totale_stock[] = $totaleStock;
            $totaleStock->setFinance($this);
        }

        return $this;
    }

    public function removeTotaleStock(Commande $totaleStock): self
    {
        if ($this->totale_stock->removeElement($totaleStock)) {
            // set the owning side to null (unless already changed)
            if ($totaleStock->getFinance() === $this) {
                $totaleStock->setFinance(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Dons>
     */
    public function getTotaleDons(): Collection
    {
        return $this->totale_Dons;
    }

    public function addTotaleDon(Dons $totaleDon): self
    {
        if (!$this->totale_Dons->contains($totaleDon)) {
            $this->totale_Dons[] = $totaleDon;
            $totaleDon->setFinance($this);
        }

        return $this;
    }

    public function removeTotaleDon(Dons $totaleDon): self
    {
        if ($this->totale_Dons->removeElement($totaleDon)) {
            // set the owning side to null (unless already changed)
            if ($totaleDon->getFinance() === $this) {
                $totaleDon->setFinance(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Evenement>
     */
    public function getTotalEvenement(): Collection
    {
        return $this->total_evenement;
    }

    public function addTotalEvenement(Evenement $totalEvenement): self
    {
        if (!$this->total_evenement->contains($totalEvenement)) {
            $this->total_evenement[] = $totalEvenement;
            $totalEvenement->setFinance($this);
        }

        return $this;
    }

    public function removeTotalEvenement(Evenement $totalEvenement): self
    {
        if ($this->total_evenement->removeElement($totalEvenement)) {
            // set the owning side to null (unless already changed)
            if ($totalEvenement->getFinance() === $this) {
                $totalEvenement->setFinance(null);
            }
        }

        return $this;
    }

   
    

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getDons(): ?Dons
    {
        return $this->dons;
    }

    public function setDons(?Dons $dons): self
    {
        $this->dons = $dons;

        return $this;
    }

    public function getEvenement(): ?Evenement
    {
        return $this->evenement;
    }

    public function setEvenement(?Evenement $evenement): self
    {
        $this->evenement = $evenement;

        return $this;
    }

    public function getCommande(): ?Commande
    {
        return $this->commande;
    }

    public function setCommande(?Commande $commande): self
    {
        $this->commande = $commande;

        return $this;
    }


    public function getSomme(): ?int
    {
        return $this->somme;
    }

    public function setSomme(int $somme): self
    {
        $this->somme = $somme;

        return $this;
    }
    public function setSomme1(int $x)
    {
        $this->somme = $x;

      
    }

    public function getColor1(): ?string
    {
        return $this->color1;
    }

    public function setColor1(string $color1): self
    {
        $this->color1 = $color1;

        return $this;
    }

    public function getColor2(): ?string
    {
        return $this->color2;
    }

    public function setColor2(string $color2): self
    {
        $this->color2 = $color2;

        return $this;
    }

    public function getColor3(): ?string
    {
        return $this->color3;
    }

    public function setColor3(string $color3): self
    {
        $this->color3 = $color3;

        return $this;
    }
}
