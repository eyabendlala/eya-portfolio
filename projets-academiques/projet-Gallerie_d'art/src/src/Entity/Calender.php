<?php

namespace App\Entity;

use App\Repository\CalenderRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;


/**
 * @ORM\Entity(repositoryClass=CalenderRepository::class)
 */
class Calender
{   /**
    * @ORM\Id()
    * @ORM\GeneratedValue()
    * @ORM\Column(type="integer")
    */
   private $id;

   /**
    * @ORM\Column(type="string", length=100)
    * @Assert\NotBlank(message="Vérfier le titre de plan")

    */
   private $title;

   /**
    * @ORM\Column(type="datetime")
     * @Assert\NotBlank(message="Vérfier la date/heure de debut de plan ")
    */
   private $start;

   /**
    * @ORM\Column(type="datetime")
    * @Assert\NotBlank(message="Vérfier la date/heure de fin de plan ")

    */
   private $end;

   /**
    * @ORM\Column(type="text")
    * @Assert\NotBlank(message="Vérfier la description de plan ")

    */
   private $description;

   /**
    * @ORM\Column(type="boolean")
     * @Assert\NotBlank(message="Vérfier la priorité  de plan ")

    */
   private $all_day;

   /**
    * @ORM\Column(type="string", length=7)
    */
   private $background_color;

   /**
    * @ORM\Column(type="string", length=7)
    */
   private $border_color;

   /**
    * @ORM\Column(type="string", length=7)
    */
   private $text_color;

   public function getId(): ?int
   {
       return $this->id;
   }

   public function getTitle(): ?string
   {
       return $this->title;
   }

   public function setTitle(string $title): self
   {
       $this->title = $title;

       return $this;
   }

   public function getStart(): ?\DateTimeInterface
   {
       return $this->start;
   }

   public function setStart(\DateTimeInterface $start): self
   {
       $this->start = $start;

       return $this;
   }

   public function getEnd(): ?\DateTimeInterface
   {
       return $this->end;
   }

   public function setEnd(\DateTimeInterface $end): self
   {
       $this->end = $end;

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

   public function getAllDay(): ?bool
   {
       return $this->all_day;
   }

   public function setAllDay(bool $all_day): self
   {
       $this->all_day = $all_day;

       return $this;
   }

   public function getBackgroundcolor(): ?string
   {
       return $this->background_color;
   }

   public function setBackgroundcolor(string $background_color): self
   {
       $this->background_color = $background_color;

       return $this;
   }

   public function getBordercolor(): ?string
   {
       return $this->border_color;
   }

   public function setBordercolor(string $border_color): self
   {
       $this->border_color = $border_color;

       return $this;
   }

   public function getTextcolor(): ?string
   {
       return $this->text_color;
   }

   public function setTextcolor(string $text_color): self
   {
       $this->text_color = $text_color;

       return $this;
   }
}
