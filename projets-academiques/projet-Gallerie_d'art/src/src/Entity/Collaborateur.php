<?php

namespace App\Entity;

use App\Repository\CollaborateurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass=CollaborateurRepository::class)
 */
class Collaborateur
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     *@Groups("post:read")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(
     * min = 2,
     * max = 9,
     * minMessage = "Le nom d'un evenement doit comporter au minimum {{ limit }} caractères",
     * maxMessage = "Le nom d'un evenement doit comporter au maximum {{ limit }} caractères"
     * )
     *@Groups("post:read")
     */
    private $NomCollaborateur;

    
    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(
     * min = 5,
     * max = 7,
     * minMessage = "Le nom d'un evenement doit comporter au minimum {{ limit }} caractères",
     * maxMessage = "Le nom d'un evenement doit comporter au maximum {{ limit }} caractères")
     *@Groups("post:read")
     */
    private $PrenomCollaborateur;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull
     *@Groups("post:read")
     */
    private $Role;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Positive
     * message = "Le numéro du tél ne doit pas être égal à 0 "
     *@Groups("post:read")
     */
    private $NumeroTel;

    /**
     * @ORM\OneToMany(targetEntity=Evenement::class, mappedBy="collaborateur1")
     */
    private $evenements;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("post:read")
     */
    private $Entreprise;

   // /**
    // * @ORM\Column(type="string", length=255)
    // */
    //private $email;

    public function __construct()
    {
        $this->evenements = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomCollaborateur(): ?string
    {
        return $this->NomCollaborateur;
    }

    public function setNomCollaborateur(string $NomCollaborateur):self
    
    {
        $this->NomCollaborateur = $NomCollaborateur;

        return $this;
    }

    public function getPrenomCollaborateur(): ?string
    {
        return $this->PrenomCollaborateur;
    }

    public function setPrenomCollaborateur(string $PrenomCollaborateur): self
    {
        $this->PrenomCollaborateur = $PrenomCollaborateur;

        return $this;
    }

    public function getRole(): ?string
    {
        return $this->Role;
    }

    public function setRole(string $Role): self
    {
        $this->Role = $Role;

        return $this;
    }

    public function getNumeroTel(): ?int
    {
        return $this->NumeroTel;
    }

    public function setNumeroTel(int $NumeroTel): self
    {
        $this->NumeroTel = $NumeroTel;

        return $this;
    }
    

    /**
     * @return Collection<int, Evenement>
     */
    public function getEvenements(): Collection
    {
        return $this->evenements;
    }

    public function addEvenement(Evenement $evenement): self
    {
        if (!$this->evenements->contains($evenement)) {
            $this->evenements[] = $evenement;
            $evenement->setCollaborateur1($this);
        }

        return $this;
    }

    public function removeEvenement(Evenement $evenement): self
    {
        if ($this->evenements->removeElement($evenement)) {
            // set the owning side to null (unless already changed)
            if ($evenement->getCollaborateur1() === $this) {
                $evenement->setCollaborateur1(null);
            }
        }

        return $this;
    }

    

    public function getEntreprise(): ?string
    {
        return $this->Entreprise;
    }

    public function setEntreprise(string $Entreprise): self
    {
        $this->Entreprise = $Entreprise;

        return $this;
    }
}
