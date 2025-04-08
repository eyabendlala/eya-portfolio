<?php

namespace App\Entity;

use App\Repository\Finance2Repository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=Finance2Repository::class)
 */
class Finance2
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     * @Groups("post:read")
     */
    private $id;

    /**
  * @ORM\Column(type="string", length=255)
     *@Groups("post:read")
     */
    private $dons;

    /**
   * @ORM\Column(type="string", length=255)
     * @Groups("post:read")
     */
    private $evenement;

    /**
    * @ORM\Column(type="string", length=255)
     * @Groups("post:read")
     */
    private $commande;

    /**
   * @ORM\Column(type="string", length=255)
     * @Groups("post:read")
     */
    private $somme;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("post:read")
     */
    private $date;

    public function getId(): ?String
    {
        return $this->id;
    }

    public function getDons(): ?String
    {
        return $this->dons;
    }

    public function setDons(String $dons): self
    {
        $this->dons = $dons;

        return $this;
    }

    public function getEvenement(): ?String
    {
        return $this->evenement;
    }

    public function setEvenement(String $evenement): self
    {
        $this->evenement = $evenement;

        return $this;
    }

    public function getCommande(): ?String
    {
        return $this->commande;
    }

    public function setCommande(String $commande): self
    {
        $this->commande = $commande;

        return $this;
    }

    public function getSomme(): ?String
    {
        return $this->somme;
    }

    public function setSomme(String $somme): self
    {
        $this->somme = $somme;

        return $this;
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
}
