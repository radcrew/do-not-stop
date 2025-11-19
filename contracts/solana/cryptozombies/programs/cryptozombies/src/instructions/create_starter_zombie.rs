use anchor_lang::prelude::*;

use crate::{
    errors::ErrorCode,
    state::{GlobalState, PlayerProfile, ZombieAccount},
};

pub fn handler(
    ctx: Context<CreateStarterZombie>,
    name: String,
    dna: u64,
    rarity: u8,
) -> Result<()> {
    require!(
        name.len() <= ZombieAccount::MAX_NAME_LEN,
        ErrorCode::NameTooLong
    );

    let global_state = &mut ctx.accounts.global_state;
    let player_profile = &mut ctx.accounts.player_profile;
    let zombie = &mut ctx.accounts.zombie;

    require!(
        !player_profile.starter_created,
        ErrorCode::StarterAlreadyCreated
    );

    player_profile.owner = ctx.accounts.owner.key();
    player_profile.starter_created = true;
    player_profile.zombie_count = player_profile.zombie_count.checked_add(1).unwrap();
    player_profile.bump = ctx.bumps.player_profile;

    let zombie_id = global_state.next_zombie_id;
    global_state.next_zombie_id = global_state.next_zombie_id.checked_add(1).unwrap();

    zombie.id = zombie_id;
    zombie.owner = ctx.accounts.owner.key();
    zombie.dna = dna;
    zombie.rarity = rarity;
    zombie.level = 1;
    zombie.ready_time = Clock::get()?.unix_timestamp;
    zombie.win_count = 0;
    zombie.loss_count = 0;
    zombie.bump = ctx.bumps.zombie;
    zombie.set_name(&name)?;

    Ok(())
}

#[derive(Accounts)]
pub struct CreateStarterZombie<'info> {
    #[account(
        mut,
        seeds = [GlobalState::SEED],
        bump = global_state.bump,
    )]
    pub global_state: Account<'info, GlobalState>,
    #[account(
        init_if_needed,
        payer = owner,
        seeds = [PlayerProfile::SEED, owner.key().as_ref()],
        bump,
        space = PlayerProfile::SPACE,
    )]
    pub player_profile: Account<'info, PlayerProfile>,
    #[account(
        init,
        payer = owner,
        seeds = [ZombieAccount::SEED, owner.key().as_ref(), &global_state.next_zombie_id.to_le_bytes()],
        bump,
        space = ZombieAccount::SPACE,
    )]
    pub zombie: Account<'info, ZombieAccount>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

