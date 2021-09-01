/** all endpoints for managing tenants, requires authentication  */
const { Auth } = require('../auth');
const { Tenants } = require('../Models/tenants.model');
const router = require('express').Router();


/** adding new tenant  */
router.put('/', Auth.guard(), async (req, res) => {
    try {
        const id = await Tenants.add(req.body);
        res.status(201);
        res.send({ id: id });
    } catch (err) {
        res.status(err.status);
        res.send(err.message);
    }
});

/** list all existing  */
router.get('/', Auth.guard(), async (req, res) => {
    try {
        const data = await Tenants.getAll();
        const tempData = data.map(t => { return { id: t.id, name: t.name, phone: t.phone, address: t.address, debt: t.debt } });
        res.status(200);
        res.send(tempData);
    } catch (err) {
        res.status(err.status);
        res.send(err.message);
    }
});

/** update one  */
router.post('/', Auth.guard(), async (req, res) => {
    try {
        await Tenants.update(req.body);
        res.status(200);
        res.send({ id: req.body.id });
    } catch (err) {
        res.status(err.status);
        res.send(err.message);
    }
});

/** remove one  */
router.delete('/:id', Auth.guard(), async (req, res) => {
    try {
        await Tenants.delete(req.params.id);
        res.status(200);
        res.send({ id: req.params.id });
    } catch (err) {
        res.status(err.status);
        res.send(err.message);
    }
});


module.exports = router;