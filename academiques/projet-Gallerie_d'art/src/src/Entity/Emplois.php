<?php

namespace App\Entity;

use App\Repository\EmploisRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;


/**
 * @ORM\Entity(repositoryClass=EmploisRepository::class)
 */
class Emplois
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups("post:read")
     */
    private $id;

    /**
     * @ORM\ManyToOne(targetEntity=User::class, inversedBy="emplois")
     * @ORM\JoinColumn(nullable=false)
     * @Groups("post:read")
     */
    private $User;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\GreaterThan("today UTC")
     * @Groups("post:read")
     */
    private $Ddebut;

    /**
     * @ORM\Column(type="datetime")
     * @Assert\GreaterThan(propertyPath="Ddebut")
     * @Groups("post:read")
     */
    private $Dfin;
    /**
     * @ORM\Column(type="string", length=10)
     * @Groups("post:read")
     */
    private $Nom;

    /**
     * @ORM\Column(type="string", length=10)
     * @Groups("post:read")
     */
    private $Prenom;

    /**
     * @ORM\Column(type="integer")
     * @Groups("post:read")
     */
    private $CIN;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUser(): ?User
    {
        return $this->User;
    }

    public function setUser(?User $User): self
    {
        $this->User = $User;

        return $this;
    }

    public function getDdebut(): ?\DateTimeInterface
    {
        return $this->Ddebut;
    }

    public function setDdebut(\DateTimeInterface $Ddebut): self
    {
        $this->Ddebut = $Ddebut;

        return $this;
    }

    public function getDfin(): ?\DateTimeInterface
    {
        return $this->Dfin;
    }

    public function setDfin(\DateTimeInterface $Dfin): self
    {
        $this->Dfin = $Dfin;

        return $this;
    }
    public function getNom(): ?string
    {
        return $this->Nom;
    }

    public function setNom(string $Nom): self
    {
        $this->Nom = $Nom;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->Prenom;
    }

    public function setPrenom(string $Prenom): self
    {
        $this->Prenom = $Prenom;

        return $this;
    }

    public function getCIN(): ?int
    {
        return $this->CIN;
    }

    public function setCIN(int $CIN): self
    {
        $this->CIN = $CIN;

        return $this;
    }
    public function serialize()
    {
        return serialize(
            [
                $this->id,
                $this->Nom,
                $this->Prenom,
                $this->Dfin,
                $this->CIN,
                $this->Ddebut,
                
            ]

        );
        // TODO: Implement serialize() method.
    }

    public function unserialize($string)
    {
        list(
            $this->id,
            $this->Nom,
            $this->Prenom,
            $this->Dfin,
            $this->CIN,
            $this->Ddebut,

            )=unserialize($string,['allowed_classes'=>false]);}

        function constructEtu($nom,$Prenom,$Dfin,$CIN,$Ddebut) {
            $this->setNom($nom);
            $this->setPrenom($Prenom);
            $this->setDfin($Dfin);
            $this->setCIN($CIN);
            $this->setDdebut($Ddebut);
            

        }
}
