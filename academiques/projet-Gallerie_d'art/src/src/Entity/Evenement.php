<?php

namespace App\Entity;

use App\Repository\EvenementRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

/**
 * @ORM\Entity(repositoryClass=EvenementRepository::class)
 */
class Evenement
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     *  @Groups("post:read")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\Length(
     * min = 5,
     * max = 200,
     * minMessage = "Le nom d'un evenement doit comporter au minimum {{ limit }} caractères",
     * maxMessage = "Le nom d'un evenement doit comporter au maximum {{ limit }} caractères"
     *  
     * )
     * @Groups("post:read")
     */
    private $NomEvenement;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotNull
     *  @Groups("post:read")
     * 
     */
    private $Description;

    /**
     * @ORM\Column(type="integer")
     * @Assert\Positive
     *  @Groups("post:read")
     */
    private $NombreDeParticipants;

    /**
     * @ORM\Column(type="string", length=255)
     * @Groups("post:read")
     */
    private $QrCode;

    /**
     * @ORM\Column(type="integer")
     * @Assert\NotEqualTo(
     * value = 0,
     * message = "Le prix d’un billet ne doit pas être égal à 0 "
     * )
     * @Groups("post:read")
     */
    private $Billet;

    /**
     * @ORM\Column(type="date")
     *  @Groups("post:read")
     */
    private $DateDeEvenement;

    /**
     * @ORM\ManyToOne(targetEntity=Collaborateur::class, inversedBy="evenements",cascade={"persist","remove"})
     * @ORM\JoinColumn(nullable=false)
     *  @Groups("post:read")
     */
    private $collaborateur1;

    /**
     * @ORM\Column(type="float")
     *  @Groups("post:read")
     */
    private $longitude;

    /**
     * @ORM\Column(type="float")
     *  @Groups("post:read")
     */
    private $latitude;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNomEvenement(): ?string
    {
        return $this->NomEvenement;
    }

    public function setNomEvenement(string $NomEvenement): self
    {
        $this->NomEvenement = $NomEvenement;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->Description;
    }

    public function setDescription(string $Description): self
    {
        $this->Description = $Description;

        return $this;
    }

    public function getNombreDeParticipants(): ?int
    {
        return $this->NombreDeParticipants;
    }

    public function setNombreDeParticipants(int $NombreDeParticipants): self
    {
        $this->NombreDeParticipants = $NombreDeParticipants;

        return $this;
    }

    public function getQrCode() 
    {
        return $this->QrCode;
    }

    public function setQrCode(string $QrCode)
    {
        $this->QrCode = $QrCode;

        return $this;
    }

    public function getBillet(): ?int
    {
        return $this->Billet;
    }

    public function setBillet(int $Billet): self
    {
        $this->Billet = $Billet;

        return $this;
    }

    public function getDateDeEvenement(): ?\DateTimeInterface
    {
        return $this->DateDeEvenement;
    }

    public function setDateDeEvenement(\DateTimeInterface $DateDeEvenement): self
    {
        $this->DateDeEvenement = $DateDeEvenement;

        return $this;
    }

    public function getCollaborateur1(): ?Collaborateur
    {
        return $this->collaborateur1;
    }

    public function setCollaborateur1(?Collaborateur $collaborateur1): self
    {
        $this->collaborateur1 = $collaborateur1;

        return $this;
    }

    public function getLongitude(): ?float
    {
        return $this->longitude;
    }

    public function setLongitude(float $longitude): self
    {
        $this->longitude = $longitude;

        return $this;
    }

    public function getLatitude(): ?float
    {
        return $this->latitude;
    }

    public function setLatitude(float $latitude): self
    {
        $this->latitude = $latitude;

        return $this;
    }
}
