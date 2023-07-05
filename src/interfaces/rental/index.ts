import { ToolInterface } from 'interfaces/tool';
import { UserInterface } from 'interfaces/user';
import { OutletInterface } from 'interfaces/outlet';
import { GetQueryInterface } from 'interfaces';

export interface RentalInterface {
  id?: string;
  tool_id?: string;
  user_id?: string;
  outlet_id?: string;
  rental_date?: any;
  return_date?: any;
  created_at?: any;
  updated_at?: any;

  tool?: ToolInterface;
  user?: UserInterface;
  outlet?: OutletInterface;
  _count?: {};
}

export interface RentalGetQueryInterface extends GetQueryInterface {
  id?: string;
  tool_id?: string;
  user_id?: string;
  outlet_id?: string;
}
