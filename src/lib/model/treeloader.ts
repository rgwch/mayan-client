import { Tree, type ITreeListener } from './tree'
import { cabinets } from './store'
import type { Cabinet } from './types';
let cabs: Array<Cabinet> = []
cabinets.subscribe(c => cabs = c)

export class CabinetTreeLoader implements ITreeListener {

    fetchChildren(t: Tree<Cabinet>): Promise<boolean> {
        const c: Cabinet = t.payload;
        const id = c.id;
        const children = cabs.filter(c => c.parent_id === id);
        children.forEach(c => new Tree(t, c, this));
        return Promise.resolve(true);
    }

}