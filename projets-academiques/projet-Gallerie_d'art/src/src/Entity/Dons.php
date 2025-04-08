<?php

namespace App\Entity;

use App\Repository\DonsRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=DonsRepository::class)
 */
class Dons
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
     * @Assert\NotBlank(message="vérifier votre num_carte")
     * @Groups("post:read")
     */
    private $num_carte;

    /**
     * @ORM\Column(type="string") 
    * @Assert\NotBlank(message="vérifier votre montant")
    * @Groups("post:read")
    */
    private $montant;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="dons")
     */
    //private $user;

    

    
    public function getId(): ?int
    {
        return $this->id;
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
}

    /*public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): self
    {
        $this->user = $user;

        return $this;
     }   

