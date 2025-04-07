<?php

namespace App\Entity;

use App\Repository\CommandeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=CommandeRepository::class)
 */
class Commande
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="integer")
     */
    private $cin;

    /**
     * @ORM\Column(type="integer")
     */
    private $total;


    /**
     * @ORM\OneToMany(targetEntity=Finance::class, mappedBy="commande")
     */
    private $totale;


    public function __construct()
    {
        $this->totale = new ArrayCollection();
    }

  

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCin(): ?int
    {
        return $this->cin;
    }

    public function setCin(int $cin): self
    {
        $this->cin = $cin;

        return $this;
    }

    public function getTotal(): ?int
    {
        return $this->total;
    }
   

    public function setTotal(int $total): self
    {
        $this->total = $total;

        return $this;
    }

   

    /**
     * @return Collection<int, Finance>
     */
    public function getTotale(): Collection
    {
        return $this->totale;
    }

    public function addTotale(Finance $totale): self
    {
        if (!$this->totale->contains($totale)) {
            $this->totale[] = $totale;
            $totale->setCommande($this);
        }

        return $this;
    }

    public function removeTotale(Finance $totale): self
    {
        if ($this->totale->removeElement($totale)) {
            // set the owning side to null (unless already changed)
            if ($totale->getCommande() === $this) {
                $totale->setCommande(null);
            }
        }

        return $this;
    }

   

   
}
