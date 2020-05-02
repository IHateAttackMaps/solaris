const ValidationError = require('../../errors/validation');

function validate(req, res, next) {
    let errors = [];

    if (!req.body.starId) {
        errors.push('starId is required.');
    }

    if (errors.length) {
        throw new ValidationError(errors);
    }

    return next();
}

module.exports = (router, io, container) => {

    const middleware = require('../middleware')(container);

    router.put('/:gameId/star/upgrade/economy', middleware.authenticate, validate, middleware.loadGame, async (req, res, next) => {
        try {
            await container.starUpgradeService.upgradeEconomy(
                req.game,
                req.session.userId,
                req.body.starId);

            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    router.put('/:gameId/star/upgrade/industry', middleware.authenticate, validate, middleware.loadGame, async (req, res, next) => {
        try {
            await container.starUpgradeService.upgradeIndustry(
                req.game,
                req.session.userId,
                req.body.starId);

            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    router.put('/:gameId/star/upgrade/science', middleware.authenticate, validate, middleware.loadGame, async (req, res, next) => {
        try {
            await container.starUpgradeService.upgradeScience(
                req.game,
                req.session.userId,
                req.body.starId);

            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    router.put('/:gameId/star/upgrade/bulk', middleware.authenticate, middleware.loadGame, async (req, res, next) => {
        try {
            let summary = await container.starUpgradeService.upgradeBulk(
                req.game,
                req.session.userId,
                req.body.infrastructure,
                +req.body.amount);

            return res.status(200).json(summary);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    router.put('/:gameId/star/build/warpgate', middleware.authenticate, validate, middleware.loadGame, async (req, res, next) => {
        try {
            await container.starUpgradeService.buildWarpGate(
                req.game,
                req.session.userId,
                req.body.starId);

            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    router.put('/:gameId/star/destroy/warpgate', middleware.authenticate, validate, middleware.loadGame, async (req, res, next) => {
        try {
            await container.starUpgradeService.destroyWarpGate(
                req.game,
                req.session.userId,
                req.body.starId);

            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    router.put('/:gameId/star/build/carrier', middleware.authenticate, validate, middleware.loadGame, async (req, res, next) => {
        try {
            await container.starUpgradeService.buildCarrier(
                req.game,
                req.session.userId,
                req.body.starId);

            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    router.put('/:gameId/star/abandon', middleware.authenticate, validate, middleware.loadGame, async (req, res, next) => {
        try {
            await container.starService.abandonStar(
                req.game,
                req.session.userId,
                req.body.starId);

            return res.sendStatus(200);
        } catch (err) {
            return next(err);
        }
    }, middleware.handleError);

    return router;

};
