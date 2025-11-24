use anchor_lang::prelude::*;

use crate::{
    errors::ErrorCode,
    state::{GlobalState, ZombieAccount},
};

pub fn handler(ctx: Context<RenameZombie>, name: String) -> Result<()> {
    require!(name.len() <= ZombieAccount::MAX_NAME_LEN, ErrorCode::NameTooLong);

    let zombie = &mut ctx.accounts.zombie;

    require_keys_eq!(zombie.owner, ctx.accounts.owner.key(), ErrorCode::Unauthorized);

    zombie.set_name(&name)?;

    Ok(())
}

#[derive(Accounts)]
pub struct RenameZombie<'info> {
    #[account(
        seeds = [GlobalState::SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        mut,
        seeds = [ZombieAccount::SEED, owner.key().as_ref(), &zombie.id.to_le_bytes()],
        bump = zombie.bump,
    )]
    pub zombie: Account<'info, ZombieAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
}
