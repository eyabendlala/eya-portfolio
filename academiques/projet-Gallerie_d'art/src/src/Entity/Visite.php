<?php

namespace App\Entity;

use App\Repository\VisiteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=VisiteRepository::class)
 * @ORM\table(name="Visite")
 */
class Visite
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups("post:read")
     */
    private $id;

    /**
     * @ORM\Column(type="string")
     *@Assert\NotBlank(message="vérifier la date")
     * @Groups("post:read")
     */
    private $date;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="vérifier les infos")
     * @Groups("post:read")
     */
    private $description;

    

    /**
     * @ORM\Column(type="string")
     * @Assert\NotBlank(message="vérifier votre num_carte")
     * @Groups("post:read")
     */
    private $num_carte;

    /**
     * @ORM\Column(type="string", precision=10, scale=0)
     * @Assert\NotBlank(message="vérifier le montant")
     * @Groups("post:read")
     */
    private $montant;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(message="vérifier le sexe")
     * @Groups("post:read")
     */
    private $sexe;
    
    /**
    * @ORM\OneToMany(targetEntity=Reservation::class, mappedBy="visite", orphanRemoval=true)
    */
    private $reservation;


    public function __construct()
    {
        $this->reservation = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDate(): ?string
    {
        return $this->date;
    }

    public function setDate(string $date): self
    {
        $this->date = $date;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    

    public function getNumCarte(): ?string
    {
        return $this->num_carte;
    }

    public function setNumCarte(string $num_carte): self
    {
        $this->num_carte = $num_carte;

        return $this;
    }

    public function getMontant(): ?string
    {
        return $this->montant;
    }

    public function setMontant(string $montant): self
    {
        $this->montant = $montant;

        return $this;
    }
    public function getSexe(): ?string
    {
        return $this->sexe;
    }

    public function setSexe(string $sexe): self
    {
        $this->sexe = $sexe;

        return $this;
    }

    /**
    * @return Collection|Reservation[]
    */
    public function getReservation(): Collection
    {
        return $this->reservation;
    }

    public function addVisite(Reservation $visite): self
    {
        if (!$this->visite->contains($visite)) {
            $this->visite[] = $visite;
            $visite->setVisite($this);
        }

        return $this;
    }

    public function removeVisite(Reservation $visite): self
    {
        if ($this->visite->removeElement($visite)) {
            // set the owning side to null (unless already changed)
            if ($visite->getVisite() === $this) {
                $visite->setVisite(null);
            }
        }
        return $this;
    }

    public function __toString(){
        return $this->description;
        }
    
}
