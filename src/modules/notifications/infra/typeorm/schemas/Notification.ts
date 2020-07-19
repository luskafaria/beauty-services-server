import {
  ObjectID,
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  ObjectIdColumn,
} from 'typeorm';

@Entity('Notifications')
class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column('uuid')
  recipient_id: string;

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Notification;
