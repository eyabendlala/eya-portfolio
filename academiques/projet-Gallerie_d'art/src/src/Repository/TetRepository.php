<?php

namespace App\Repository;

use App\Entity\Tet;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Tet|null find($id, $lockMode = null, $lockVersion = null)
 * @method Tet|null findOneBy(array $criteria, array $orderBy = null)
 * @method Tet[]    findAll()
 * @method Tet[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class TetRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Tet::class);
    }

    // /**
    //  * @return Tet[] Returns an array of Tet objects
    //  */
    /*
    public function findByExampleField($value)
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->orderBy('t.id', 'ASC')
            ->setMaxResults(10)
            ->getQuery()
            ->getResult()
        ;
    }
    */

    /*
    public function findOneBySomeField($value): ?Tet
    {
        return $this->createQueryBuilder('t')
            ->andWhere('t.exampleField = :val')
            ->setParameter('val', $value)
            ->getQuery()
            ->getOneOrNullResult()
        ;
    }
    */
}
