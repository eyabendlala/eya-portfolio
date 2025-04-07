<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220309172537 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE calender (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(100) NOT NULL, start DATETIME NOT NULL, end DATETIME NOT NULL, description LONGTEXT NOT NULL, all_day TINYINT(1) NOT NULL, background_color VARCHAR(7) NOT NULL, border_color VARCHAR(7) NOT NULL, text_color VARCHAR(7) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE collaborateur (id INT AUTO_INCREMENT NOT NULL, nom_collaborateur VARCHAR(255) NOT NULL, prenom_collaborateur VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, numero_tel INT NOT NULL, entreprise VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE emplois (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, ddebut DATETIME NOT NULL, dfin DATETIME NOT NULL, nom VARCHAR(10) NOT NULL, prenom VARCHAR(10) NOT NULL, cin INT NOT NULL, INDEX IDX_461274B9A76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE evenement (id INT AUTO_INCREMENT NOT NULL, collaborateur1_id INT NOT NULL, nom_evenement VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, nombre_de_participants INT NOT NULL, qr_code VARCHAR(255) NOT NULL, billet INT NOT NULL, date_de_evenement DATE NOT NULL, longitude DOUBLE PRECISION NOT NULL, latitude DOUBLE PRECISION NOT NULL, INDEX IDX_B26681E6AA2E66A (collaborateur1_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reclamation (id INT AUTO_INCREMENT NOT NULL, username_id INT NOT NULL, type VARCHAR(255) NOT NULL, msg VARCHAR(255) NOT NULL, dater DATE NOT NULL, INDEX IDX_CE606404ED766068 (username_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE reponse (id INT AUTO_INCREMENT NOT NULL, reclamation_id INT DEFAULT NULL, rep VARCHAR(255) NOT NULL, INDEX IDX_5FB6DEC72D6BA2D9 (reclamation_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE `user` (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(10) NOT NULL, prenom VARCHAR(10) NOT NULL, password INT NOT NULL, cin INT NOT NULL, role VARCHAR(10) NOT NULL, access VARCHAR(10) NOT NULL, image VARCHAR(255) NOT NULL, datenaissance DATE NOT NULL, UNIQUE INDEX UNIQ_8D93D649ABE530DA (cin), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE emplois ADD CONSTRAINT FK_461274B9A76ED395 FOREIGN KEY (user_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE evenement ADD CONSTRAINT FK_B26681E6AA2E66A FOREIGN KEY (collaborateur1_id) REFERENCES collaborateur (id)');
        $this->addSql('ALTER TABLE reclamation ADD CONSTRAINT FK_CE606404ED766068 FOREIGN KEY (username_id) REFERENCES `user` (id)');
        $this->addSql('ALTER TABLE reponse ADD CONSTRAINT FK_5FB6DEC72D6BA2D9 FOREIGN KEY (reclamation_id) REFERENCES reclamation (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE evenement DROP FOREIGN KEY FK_B26681E6AA2E66A');
        $this->addSql('ALTER TABLE reponse DROP FOREIGN KEY FK_5FB6DEC72D6BA2D9');
        $this->addSql('ALTER TABLE emplois DROP FOREIGN KEY FK_461274B9A76ED395');
        $this->addSql('ALTER TABLE reclamation DROP FOREIGN KEY FK_CE606404ED766068');
        $this->addSql('DROP TABLE calender');
        $this->addSql('DROP TABLE collaborateur');
        $this->addSql('DROP TABLE emplois');
        $this->addSql('DROP TABLE evenement');
        $this->addSql('DROP TABLE reclamation');
        $this->addSql('DROP TABLE reponse');
        $this->addSql('DROP TABLE `user`');
    }
}
